const fs = require('fs')
const path = require('path')

const reportsDir = path.join('reports', 'html')

if (!fs.existsSync(reportsDir)) {
	console.log('reports/html não existe, nada a fazer')
	process.exit(0)
}

const subdirs = ['api', 'e2e']

subdirs.forEach((sub) => {
	const subDir = path.join(reportsDir, sub)
	if (!fs.existsSync(subDir)) return

	fs.readdirSync(subDir, { withFileTypes: true })
		.filter((d) => d.isDirectory() && d.name.endsWith('.cy.js'))
		.forEach((d) => {
			const from = path.join(subDir, d.name)
			const to = path.join(reportsDir, d.name)

			if (!fs.existsSync(to)) {
				console.log(`Movendo ${from} → ${to}`)
				fs.renameSync(from, to)
			} else {
				console.log(`Destino já existe, mantendo: ${to}`)
			}
		})

	if (fs.readdirSync(subDir).length === 0) {
		fs.rmdirSync(subDir)
	}
})

console.log('Flatten de screenshots concluído.')
