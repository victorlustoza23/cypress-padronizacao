let sessionId = null

Cypress.Commands.add('gui_login', (user = Cypress.env('USER_EMAIL'), password = Cypress.env('USER_PASSWORD'), { cacheSession = true } = {}) => {
	const login = () => {
		cy.visit(`${Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL')}/verificar`, { timeout: 7000 })
		cy.contains('Concordar e fechar').should('be.visible').click()
		cy.get('[type="text"]').type(user, { log: false })
		cy.contains('Continuar').click()
		cy.get('[type="password"]').type(password, { log: false })
		cy.contains('Continuar').click()
		cy.get('[data-icon="xmark"]').click()
		cy.contains('Minha Conta').should('be.visible')
	}

	const validate = () => {
		cy.visit(Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL'))
		cy.contains('Minha Conta').should('be.visible')
	}

	const options = {
		cacheAcrossSpecs: true,
		validate,
	}

	if (cacheSession) {
		if (!sessionId) {
			sessionId = `gui_session_v1_${user}`
		}
		cy.session(sessionId, login, options)
	} else {
		login()
	}
})

Cypress.Commands.add('gui_setupUserAgent', () => {
	const castleBrowserToken = Cypress.env('CASTLE_BROWSER_TOKEN')
	const customUserAgent = Cypress.env('CUSTOM_USER_AGENT')

	const parseRequestBody = (body, contentType) => {
		if (!body) return null

		if (typeof body === 'object' && !Array.isArray(body)) {
			return { data: body, isFormUrlEncoded: false, originalContentType: contentType }
		}

		if (typeof body === 'string') {
			const looksLikeJson = body.trim().startsWith('{') || body.trim().startsWith('[')

			if (looksLikeJson) {
				try {
					const parsed = JSON.parse(body)
					return { data: parsed, isFormUrlEncoded: false, originalContentType: contentType || 'application/json' }
				} catch (e) {}
			}

			try {
				const params = new URLSearchParams(body)
				const data = {}
				for (const [key, value] of params.entries()) {
					data[key] = value
				}
				return { data, isFormUrlEncoded: true, originalContentType: contentType || 'application/x-www-form-urlencoded' }
			} catch (e) {
				console.log('[parseRequestBody] Erro ao parsear body:', e.message, '| Body:', body.substring(0, 100))
				return { data: body, isFormUrlEncoded: false, originalContentType: contentType }
			}
		}

		return { data: body, isFormUrlEncoded: false, originalContentType: contentType }
	}

	const serializeRequestBody = (bodyData, isFormUrlEncoded) => {
		if (isFormUrlEncoded) {
			const params = new URLSearchParams()
			for (const [key, value] of Object.entries(bodyData)) {
				params.append(key, value)
			}
			return params.toString()
		} else {
			return JSON.stringify(bodyData)
		}
	}

	cy.intercept('**/*', (req) => {
		req.headers['User-Agent'] = customUserAgent
	})

	cy.intercept('POST', '**/api/auth/verify-customer-email', (req) => {
		req.headers['User-Agent'] = customUserAgent

		if (req.body) {
			try {
				const contentType = req.headers['content-type'] || req.headers['Content-Type']
				const parsed = parseRequestBody(req.body, contentType)

				if (parsed && parsed.data) {
					parsed.data.requestToken = castleBrowserToken
					req.body = serializeRequestBody(parsed.data, parsed.isFormUrlEncoded)
					req.headers['content-type'] = parsed.originalContentType || (parsed.isFormUrlEncoded ? 'application/x-www-form-urlencoded' : 'application/json')
				}
			} catch (e) {
				console.error('[verify-customer-email] Erro ao modificar body:', e.message)
				console.error('[verify-customer-email] Stack:', e.stack)
			}
		}
	}).as('verifyEmail')

	cy.intercept('POST', '**/api/auth/callback/customerAuth', (req) => {
		req.headers['User-Agent'] = customUserAgent

		if (req.body) {
			try {
				const contentType = req.headers['content-type'] || req.headers['Content-Type']
				const parsed = parseRequestBody(req.body, contentType)

				if (parsed && parsed.data) {
					parsed.data.token = castleBrowserToken
					req.body = serializeRequestBody(parsed.data, parsed.isFormUrlEncoded)
					req.headers['content-type'] = parsed.originalContentType || (parsed.isFormUrlEncoded ? 'application/x-www-form-urlencoded' : 'application/json')
				}
			} catch (e) {
				console.error('[customerAuth] Erro ao modificar body:', e.message)
				console.error('[customerAuth] Stack:', e.stack)
			}
		}
	}).as('customerAuth')
})
