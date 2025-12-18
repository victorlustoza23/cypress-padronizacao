/**
 * Arquivo de suporte global para testes E2E e API
 *
 * Este arquivo é carregado automaticamente antes de cada spec e contém:
 * - Importação de comandos customizados (GUI e API)
 * - Configuração de plugins (grep, mochawesome, api)
 * - Hooks globais (anexo automático de screenshots de falha)
 */

// Importa comandos customizados para uso em todos os testes
import './api_commands'
import './gui_commands'

// Plugins que melhoram a experiência de testes
import 'cypress-plugin-api' // Melhora logs e ergonomia de chamadas API
import 'cypress-mochawesome-reporter/register' // Registra reporter para geração de relatórios HTML

// Configura @cypress/grep para permitir filtragem de testes por tags
const { register: registerCypressGrep } = require('@cypress/grep')
registerCypressGrep()

import addContext from 'mochawesome/addContext'

/**
 * Hook que anexa automaticamente screenshots de falha ao relatório mochawesome
 *
 * Comportamento:
 * - Executa após cada teste (test:after:run)
 * - Se o teste passou, não faz nada
 * - Se o teste falhou, anexa screenshots de todas as tentativas (incluindo retries)
 *
 * Estrutura de screenshots esperada:
 * reports/html/<specName>/<suite> -- <teste> (failed).png
 * reports/html/<specName>/<suite> -- <teste> (failed) (attempt 2).png
 * reports/html/<specName>/<suite> -- <teste> (failed) (attempt 3).png
 *
 * Isso permite visualizar no relatório HTML todas as tentativas de um teste que falhou,
 * facilitando debugging de testes instáveis que falham após retries.
 */
Cypress.on('test:after:run', (test, runnable) => {
	// Ignora testes que passaram
	if (test.state !== 'failed') return

	const specName = Cypress.spec.name // ex: login.cy.js
	const base = `./${specName}` // pasta: reports/html/login.cy.js

	// Screenshot da tentativa final (a que aparece no log principal do Cypress)
	const last = `${base}/${runnable.parent.title} -- ${test.title} (failed).png`
	addContext({ test }, { title: 'Failed screenshot (last attempt)', value: last })

	// Screenshots das tentativas anteriores (retries), se existirem
	// test.currentRetry indica quantas vezes o teste foi executado antes de falhar definitivamente
	for (let attempt = 2; attempt <= test.currentRetry + 1; attempt++) {
		const shot = `${base}/${runnable.parent.title} -- ${test.title} (failed) (attempt ${attempt}).png`
		addContext({ test }, { title: `Failed screenshot (attempt ${attempt - 1})`, value: shot })
	}
})

Cypress.on('uncaught:exception', (err, runnable) => {
	// Ignora só o “Script error” de cross‑origin
	if (err.message.includes('Script error')) {
		return false // Não falha o teste
	}

	// Para qualquer outro erro, deixa o teste falhar normalmente
	return true
})
