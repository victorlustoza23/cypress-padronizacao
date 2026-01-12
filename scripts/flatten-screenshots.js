const fs = require('fs')
const path = require('path')

const reportsDir = path.join('reports', 'html')

/**
 * Move RECURSIVAMENTE qualquer pasta *.cy.js para reports/html/*.cy.js/
 * Suporta: api/api-quotation.cy.js → reports/html/api-quotation.cy.js/
 *          e2e/gui-login.cy.js → reports/html/gui-login.cy.js/
 */
function flattenSpecFolders(dir) {
  if (!fs.existsSync(dir)) return

  fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory() && item.name.endsWith('.cy.js'))
    .forEach((item) => {
      const specFrom = path.join(dir, item.name)
      const specTo = path.join(reportsDir, item.name)

      if (!fs.existsSync(specTo)) {
        console.log(`📁 Movendo: ${specFrom} → ${specTo}`)
        fs.renameSync(specFrom, specTo)
      }
    })

  // Chama recursivamente em subpastas
  fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory() && !item.name.endsWith('.cy.js'))
    .forEach((item) => flattenSpecFolders(path.join(dir, item.name)))
}

// Executa em toda árvore reports/html/
flattenSpecFolders(reportsDir)

// Limpa pastas vazias
function cleanEmptyDirs(dir) {
  fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .forEach((item) => {
      const fullPath = path.join(dir, item.name)
      cleanEmptyDirs(fullPath)

      if (fs.readdirSync(fullPath).length === 0) {
        console.log(`🗑️  Removendo pasta vazia: ${fullPath}`)
        fs.rmdirSync(fullPath)
      }
    })
}

cleanEmptyDirs(reportsDir)
console.log('✅ Flatten completo! Todas screenshots em reports/html/*.cy.js/')
