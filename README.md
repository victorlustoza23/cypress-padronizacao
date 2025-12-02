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

- Node.js v24.11.1 (recomendado LTS).
- npm 11.6.3 (vem com o Node mais recente).
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

### Execução local

1. Rodar os testes (`npm run test:headless` ou similar).
2. `npm run merge-reports` para juntar todos os `.json` do mochawesome.
3. `npm run fix-reports` (opcional, mas recomendado) para ajustar screenshots.
4. `npm run generate-report` para gerar `reports/html/merged-report.html`.

Os relatórios ficam disponíveis em `reports/html`. É possível publicá-los em
pipelines ou anexá-los manualmente quando necessário.

## Integração contínua (GitHub Actions)

O workflow `.github/workflows/cypress.yml` roda automaticamente em pushes para
a branch `master`. Ele divide a suíte em três partes por meio do `cypress-split`,
executando cada fatia em paralelo em runners separados.

### Como funciona

1. **Execução paralela**: Três jobs (`Spec split 1/3`, `Spec split 2/3`,
   `Spec split 3/3`) executam simultaneamente, cada um rodando uma parte dos
   testes.
2. **Coleta de artefatos**: Cada job gera um JSON de relatório e screenshots
   (se houver falhas), que são enviados como artefatos nomeados
   `cypress-part-0`, `cypress-part-1`, `cypress-part-2`.
3. **Consolidação**: Um job dedicado (`Consolidar relatórios`) baixa todos os
   artefatos, renomeia os JSONs para evitar conflitos, consolida tudo em um
   único relatório HTML e publica como `cypress-report-html`.

### Como acessar o relatório

1. Acesse o run desejado em **GitHub Actions**.
2. Role até o final da página e localize a seção **Artifacts**.
3. Faça download de `cypress-report-html`.
4. Extraia o ZIP e abra `reports/html/merged-report.html` no navegador.

O relatório consolidado contém todos os testes de todos os splits, permitindo
visualizar a execução completa em um único lugar, mesmo quando os testes foram
executados em paralelo.

1. Acesse o run desejado em GitHub Actions.
2. Faça download de `cypress-report-html`.
3. Extraia o conteúdo e abra `reports/html/report-generated.html` (ou
   `merged-report.html`) no navegador para visualizar o resultado.

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
