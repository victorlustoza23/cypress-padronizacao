/**
 * Comandos customizados para testes de interface gráfica
 *
 * Este arquivo contém comandos personalizados do Cypress para automação de testes GUI,
 * incluindo gerenciamento de sessões de login com cache.
 */

// Variável para armazenar o sessionId único por usuário
// Permite reutilização da mesma sessão entre múltiplas chamadas e entre specs diferentes
let sessionId = null

/**
 * Comando customizado para realizar login na aplicação MadeiraMadeira
 *
 * @param {string} user - Email do usuário (padrão: USER_EMAIL do env)
 * @param {string} password - Senha do usuário (padrão: USER_PASSWORD do env)
 * @param {Object} options - Opções de configuração
 * @param {boolean} options.cacheSession - Se true, usa cy.session para cachear a sessão (padrão: true)
 *
 * Comportamento:
 * - Se cacheSession = true: usa cy.session para criar/restaurar sessão, permitindo reutilização
 * - Se cacheSession = false: executa login completo a cada chamada (útil para testes isolados)
 */
Cypress.Commands.add('gui_login', (user = Cypress.env('USER_EMAIL'), password = Cypress.env('USER_PASSWORD'), { cacheSession = true } = {}) => {
	/**
	 * Função que executa o fluxo completo de login
	 * Chamada diretamente quando cacheSession = false, ou dentro de cy.session quando cacheSession = true
	 */
	const login = () => {
		// Navega para a página de verificação/login
		cy.visit(`${Cypress.env('MADEIRAMADEIRA_STAGING_URL')}/verificar`, { timeout: 7000, failOnStatusCode: false })

		// Fecha o banner de cookies se estiver visível
		cy.contains('Concordar e fechar').should('be.visible').click()

		// Preenche email e continua
		cy.get('[type="text"]').type(user, { log: false })
		cy.contains('Continuar').click()

		// Preenche senha e continua
		cy.get('[type="password"]').type(password, { log: false })
		cy.contains('Continuar').click()

		// Aguarda o login completar: fecha modal e verifica que "Minha Conta" está visível
		// Isso garante que o fluxo de autenticação terminou antes do snapshot da sessão
		cy.get('[data-icon="xmark"]').click()
		cy.contains('Minha Conta').should('be.visible')
	}

	/**
	 * Função de validação executada pelo cy.session para verificar se a sessão ainda é válida
	 * Chamada automaticamente quando uma sessão é restaurada (não criada)
	 *
	 * Se a validação falhar, o Cypress recria a sessão chamando login() novamente
	 */
	const validate = () => {
		// Visita a home e verifica se o usuário ainda está logado
		// Se "Minha Conta" estiver visível, significa que a sessão é válida
		cy.visit(Cypress.env('MADEIRAMADEIRA_STAGING_URL'))
		cy.contains('Minha Conta').should('be.visible')
	}

	// Opções para o cy.session
	const options = {
		cacheAcrossSpecs: true, // Permite reutilizar a sessão entre specs diferentes
		validate, // Função de validação para verificar se a sessão ainda é válida
	}

	if (cacheSession) {
		// Modo com cache de sessão: usa cy.session para criar/restaurar sessão
		// Gera um sessionId estável por usuário (sem timestamp)
		// Isso permite que o mesmo usuário reaproveite a mesma sessão entre testes
		if (!sessionId) {
			// Sufixo de versão (v1) evita conflito com sessões antigas que usavam
			// funções de validate diferentes (Cypress não permite reutilizar sessionId
			// se a função validate mudou)
			sessionId = `gui_session_v1_${user}`
		}
		cy.session(sessionId, login, options)
	} else {
		// Modo sem cache: executa login completo a cada chamada
		// Útil para testes que precisam de isolamento completo
		login()
	}
})

Cypress.Commands.add('gui_setupUserAgent', () => {
	const usersAutomation = Cypress.env('usersAutomation')
	const castleBrowserToken = Cypress.env('CASTLE_BROWSER_TOKEN')
	const customUserAgent = Cypress.env('CUSTOM_USER_AGENT')

	cy.intercept('**/*', (req) => {
		req.headers['User-Agent'] = customUserAgent
	})

	// Interceptar e modificar requisição de verificação de email
	cy.intercept('POST', '**/api/auth/verify-customer-email', (req) => {
		req.headers['User-Agent'] = customUserAgent
		console.log('Interceptando verify-customer-email')

		// Modificar o body se existir
		if (req.body) {
			try {
				let bodyData
				if (typeof req.body === 'string') {
					bodyData = JSON.parse(req.body)
				} else {
					bodyData = req.body
				}

				// Adicionar o token Castle
				bodyData.requestToken = castleBrowserToken
				req.body = JSON.stringify(bodyData)
			} catch (e) {
				console.log('Erro ao modificar body do verify-customer-email:', e)
			}
		}
	}).as('verifyEmail')

	// Interceptar e modificar requisição de autenticação
	cy.intercept('POST', '**/api/auth/callback/customerAuth', (req) => {
		req.headers['User-Agent'] = customUserAgent
		console.log('Interceptando customerAuth')

		// Modificar o body se existir
		if (req.body) {
			try {
				let bodyData
				if (typeof req.body === 'string') {
					bodyData = JSON.parse(req.body)
				} else {
					bodyData = req.body
				}

				// Adicionar o token Castle
				bodyData.token = castleBrowserToken
				req.body = JSON.stringify(bodyData)
			} catch (e) {
				console.log('Erro ao modificar body do customerAuth:', e)
			}
		}
	}).as('customerAuth')
})
