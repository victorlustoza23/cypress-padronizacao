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
		cy.visit(`${Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL')}/verificar`, { timeout: 7000 })

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
		cy.visit(Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL'))
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
	const castleBrowserToken = Cypress.env('CASTLE_BROWSER_TOKEN')
	const customUserAgent = Cypress.env('CUSTOM_USER_AGENT')

	/**
	 * Função auxiliar para parsear o body da requisição
	 * Suporta tanto JSON quanto application/x-www-form-urlencoded
	 */
	const parseRequestBody = (body, contentType) => {
		if (!body) return null

		// Se já é um objeto, retorna direto
		if (typeof body === 'object' && !Array.isArray(body)) {
			return { data: body, isFormUrlEncoded: false, originalContentType: contentType }
		}

		// Se é string, tenta detectar e parsear
		if (typeof body === 'string') {
			// Fluxo feliz: tenta JSON se parecer JSON
			const looksLikeJson = body.trim().startsWith('{') || body.trim().startsWith('[')

			if (looksLikeJson) {
				try {
					const parsed = JSON.parse(body)
					return { data: parsed, isFormUrlEncoded: false, originalContentType: contentType || 'application/json' }
				} catch (e) {
					// Fallback: tenta form-urlencoded se JSON falhar
				}
			}

			// Fluxo feliz: tenta form-urlencoded
			try {
				const params = new URLSearchParams(body)
				const data = {}
				for (const [key, value] of params.entries()) {
					data[key] = value
				}
				return { data, isFormUrlEncoded: true, originalContentType: contentType || 'application/x-www-form-urlencoded' }
			} catch (e) {
				// Fallback: retorna como está se ambos falharem
				console.log('[parseRequestBody] Erro ao parsear body:', e.message, '| Body:', body.substring(0, 100))
				return { data: body, isFormUrlEncoded: false, originalContentType: contentType }
			}
		}

		// Fallback final
		return { data: body, isFormUrlEncoded: false, originalContentType: contentType }
	}

	/**
	 * Função auxiliar para serializar o body de volta ao formato original
	 */
	const serializeRequestBody = (bodyData, isFormUrlEncoded) => {
		if (isFormUrlEncoded) {
			// Converte objeto para form-urlencoded
			const params = new URLSearchParams()
			for (const [key, value] of Object.entries(bodyData)) {
				params.append(key, value)
			}
			return params.toString()
		} else {
			// Converte objeto para JSON
			return JSON.stringify(bodyData)
		}
	}

	cy.intercept('**/*', (req) => {
		req.headers['User-Agent'] = customUserAgent
	})

	// Interceptar e modificar requisição de verificação de email
	cy.intercept('POST', '**/api/auth/verify-customer-email', (req) => {
		req.headers['User-Agent'] = customUserAgent

		// Modificar o body se existir
		if (req.body) {
			try {
				const contentType = req.headers['content-type'] || req.headers['Content-Type']
				const parsed = parseRequestBody(req.body, contentType)

				if (parsed && parsed.data) {
					// Adicionar o token Castle
					parsed.data.requestToken = castleBrowserToken
					req.body = serializeRequestBody(parsed.data, parsed.isFormUrlEncoded)

					// Preserva o Content-Type original ou usa o detectado
					req.headers['content-type'] = parsed.originalContentType || (parsed.isFormUrlEncoded ? 'application/x-www-form-urlencoded' : 'application/json')
				}
			} catch (e) {
				console.error('[verify-customer-email] Erro ao modificar body:', e.message)
				console.error('[verify-customer-email] Stack:', e.stack)
			}
		}
	}).as('verifyEmail')

	// Interceptar e modificar requisição de autenticação
	cy.intercept('POST', '**/api/auth/callback/customerAuth', (req) => {
		req.headers['User-Agent'] = customUserAgent

		// Modificar o body se existir
		if (req.body) {
			try {
				const contentType = req.headers['content-type'] || req.headers['Content-Type']
				const parsed = parseRequestBody(req.body, contentType)

				if (parsed && parsed.data) {
					// Adicionar o token Castle
					parsed.data.token = castleBrowserToken
					req.body = serializeRequestBody(parsed.data, parsed.isFormUrlEncoded)

					// Preserva o Content-Type original ou usa o detectado
					req.headers['content-type'] = parsed.originalContentType || (parsed.isFormUrlEncoded ? 'application/x-www-form-urlencoded' : 'application/json')
				}
			} catch (e) {
				console.error('[customerAuth] Erro ao modificar body:', e.message)
				console.error('[customerAuth] Stack:', e.stack)
			}
		}
	}).as('customerAuth')
})
