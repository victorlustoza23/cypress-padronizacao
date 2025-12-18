/**
 * Configuração principal do Cypress
 *
 * Define comportamentos globais, plugins, relatórios e padrões de execução.
 */

import { defineConfig } from 'cypress'
const cypressSplit = require('cypress-split') // Plugin para dividir execução em paralelo
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin' // Plugin para filtragem por tags

export default defineConfig({
	// Reporter que gera relatórios HTML com mochawesome
	reporter: 'cypress-mochawesome-reporter',
	reporterOptions: {
		reportDir: 'reports/html/', // Diretório onde serão gerados os relatórios
		reportFilename: 'report-generated', // Nome base do arquivo HTML gerado
		charts: true, // Inclui gráficos de sucesso/falha no relatório
		embeddedScreenshots: true, // Incorpora screenshots diretamente no HTML (não precisa de links externos)
		overwrite: true, // Sobrescreve relatórios anteriores
		json: true, // Gera também arquivo JSON para merge posterior (útil em execuções paralelas)
	},
	// Screenshots são salvos junto com os relatórios para facilitar acesso
	screenshotsFolder: 'reports/html/',
	e2e: {
		env: {
			// Configurações do @cypress/grep
			grepFilterSpecs: true, // Filtra specs inteiras quando nenhum teste da spec corresponde à tag
			grepOmitFiltered: true, // Omite specs filtradas do relatório (não conta como skipped)
			hideCredentials: true, // Oculta credenciais nos logs (segurança)
			snapshotOnly: true, // Aplica snapshots apenas em modo snapshot (otimização)
		},
		// Retries automáticos para lidar com testes instáveis/flaky
		// runMode: usado em 'cypress run' (CI/local headless)
		// openMode: usado em 'cypress open' (modo interativo)
		retries: {
			runMode: 2, // Tenta até 2 vezes antes de falhar definitivamente em modo headless
			openMode: 2, // Tenta até 2 vezes antes de falhar definitivamente no modo interativo
		},
		// Padrão de busca de specs: inclui tanto testes E2E quanto de API
		specPattern: ['cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 'cypress/api/**/*.cy.{js,jsx,ts,tsx}'],
		supportFile: 'cypress/support/e2e.js', // Arquivo de suporte global carregado antes de cada spec
		viewportHeight: 1000, // Altura padrão da viewport (ajuste conforme necessidade)
		viewportWidth: 1280, // Largura padrão da viewport (ajuste conforme necessidade)
		// Flag experimental: permite executar todas as specs em uma única sessão do navegador
		// Útil para testes que compartilham estado entre specs (ex: sessões cacheadas)
		experimentalRunAllSpecs: true,
		// Timeout padrão para comandos (30 segundos)
		// Aumentado para lidar com aplicações que podem ter latência maior
		defaultCommandTimeout: 30000,
		setupNodeEvents(on, config) {
			// Registra plugin do mochawesome para processar eventos durante a execução
			require('cypress-mochawesome-reporter/plugin')(on)

			// Plugin para dividir execução em múltiplas máquinas/jobs (paralelização)
			// Usado com variáveis de ambiente SPLIT e SPLIT_INDEX
			// Exemplo: SPLIT=3 SPLIT_INDEX=0 npx cypress run (executa 1/3 das specs)
			cypressSplit(on, config)

			// Plugin para filtragem de testes por tags (@cypress/grep)
			// Permite executar apenas testes com tags específicas: --env grepTags='@login'
			cypressGrepPlugin(config)
			return config
		},
	},
})
