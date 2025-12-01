# Cypress Padronização

Suite de testes end-to-end e API construída com Cypress para demonstrar boas
práticas de padronização, organização e geração de relatórios automáticos.
O projeto utiliza tags, divisão de testes em paralelo e mochawesome para
gerar relatórios HTML unificados após cada execução.

## Principais recursos

- Cypress 15 com retries configurados e viewport padronizado.
- Suporte a `@cypress/grep` para executar specs ou cenários filtrados por tag.
- Divisão de execuções com `cypress-split`, facilitando pipelines paralelos.
- Estrutura de comandos customizados (`api_commands` e `gui_commands`) para
  reutilizar interações comuns.
- Relatórios visuais em `reports/html` via `cypress-mochawesome-reporter`,
  com screenshots incorporados e processo automatizado de merge/fix.
- Ferramentas auxiliares para listar specs e contar tags (`find-cypress-specs`).

## Pré-requisitos

- Node.js 18+ (recomendado LTS).
- npm 9+ (vem com o Node mais recente).
- Acesso ao Git e ao repositório remoto.

## Como executar

1. Clonar o repositório e acessar a pasta:
   ```bash
   git clone https://github.com/<seu-usuario>/cypress-padronizacao.git
   cd cypress-padronizacao
   ```
2. Instalar dependências:
   ```bash
   npm install
   ```
3. Executar os testes no modo interativo:
   ```bash
   npm test
   ```
4. Executar os testes em headless (CI):
   ```bash
   npm run test:headless
   ```

## Scripts disponíveis

- `npm test`: abre o Cypress Runner.
- `npm run test:headless`: roda toda a suíte em modo headless.
- `npm run test:headless:login|cart|checkout`: executa apenas os cenários
  marcados com as tags correspondentes (`@login`, `@cart`, `@checkout`).
- `npm run cy:split:1|2|3`: divide a execução total em três fatias usando
  variáveis `SPLIT` e `SPLIT_INDEX` (útil para pipelines paralelos).
- `npm run list:spec:names`: lista os arquivos de spec encontrados.
- `npm run count:by:tags`: mostra as tags presentes nas specs.
- `npm run merge-reports`: combina os JSON gerados pelo mochawesome.
- `npm run fix-reports`: corrige caminhos de screenshots antes do HTML final.
- `npm run generate-report`: gera o HTML final em `reports/html`.
- `npm run post-test`: executa merge + generate em sequência (ideal para CI).

## Estrutura relevante

```
cypress/
 ├─ e2e/                 # Specs de exemplo (login, cart, checkout)
 ├─ fixtures/            # Massas de dados estáticas
 ├─ screenshots/         # Screenshots com falhas ou evidências
 └─ support/
     ├─ e2e.js           # Bootstrap: plugins, estilos e registros globais
     ├─ api_commands.js  # Comandos customizados para fluxos de API
     └─ gui_commands.js  # Espaço para comandos de UI
reports/
 └─ html/                # Saída do mochawesome (JSON, HTML e assets)
cypress.config.js        # Configurações gerais de e2e e reporter
package.json             # Scripts e dependências
```

## Fluxo de relatórios

1. Rodar os testes (`npm run test:headless` ou similar).
2. `npm run merge-reports` para juntar todos os `.json` do mochawesome.
3. `npm run fix-reports` (opcional, mas recomendado) para ajustar screenshots.
4. `npm run generate-report` para gerar `reports/html/merged-report.html`.

Os relatórios ficam disponíveis em `reports/html`. É possível publicá-los em
pipelines ou anexá-los manualmente quando necessário.

## Execução filtrada por tags

Graças ao `@cypress/grep`, você pode usar `--env grepTags="@login"`
diretamente nos comandos do Cypress. Os scripts `test:headless:*` já fazem
isso por conveniência, mas você pode criar novos comandos seguindo o mesmo
padrão.

## Boas práticas sugeridas

- Centralize toda automação em comandos reutilizáveis nos arquivos de suporte.
- Use tags para distinguir fluxos (ex.: `@regressao`, `@critico`).
- Padronize a geração de evidências e publique os relatórios mochawesome
  após cada execução em CI.
- Utilize `cypress-split` para reduzir o tempo total dividindo specs em jobs
  paralelos.

## Próximos passos

- Adicionar cenários reais consumindo `Cypress.env` para URLs e credenciais.
- Popular `gui_commands.js` e `api_commands.js` com ações comuns (login, navegação etc.).
- Integrar `cypress-codegen` (já referenciado no config) se desejar gerar
  scaffolds automáticos de specs.
