## Cypress Padronização

Suite de testes end-to-end e de API construída com Cypress para demonstrar boas
práticas de padronização, organização e geração de relatórios automáticos.
O projeto utiliza tags, divisão de testes em paralelo e mochawesome para
gerar relatórios HTML unificados, com screenshots de falha anexados
automaticamente.

### Principais recursos

-   **Cypress 15 configurado**: viewport padronizado, `retries` para rodar
    novamente testes instáveis e `defaultCommandTimeout` ajustado.
-   **Suporte a `@cypress/grep`**: permite filtrar a execução por tags, tanto
    em nível de spec quanto em nível de cenário.
-   **Divisão de execuções com `cypress-split`**: facilita a paralelização em
    pipelines ou execuções distribuídas.
-   **Comandos customizados reutilizáveis** em `api_commands` e `gui_commands`
    para manter as specs mais limpas e legíveis.
-   **Relatórios mochawesome em `reports/html`**, com screenshots incorporados
    e estrutura pronta para merge dos arquivos `.json`.
-   **Integração com `test:after:run`** em `cypress/support/e2e.js` para
    anexar, em cada teste que falha, as screenshots salvas pelo Cypress ao
    relatório mochawesome.

### Pré-requisitos

-   Node.js v24.11.1 (recomendado LTS).
-   npm 11.6.3 (vem com o Node mais recente).
-   Acesso ao Git e ao repositório remoto.

### Como executar

1. **Clonar o repositório e acessar a pasta**:

    ```bash
    git clone https://github.com/<seu-usuario>/cypress-padronizacao.git
    cd cypress-padronizacao
    ```

2. **Instalar dependências**:

    ```bash
    npm install
    ```

3. **Executar os testes no modo interativo**:

    ```bash
    npm test
    ```

4. **Executar os testes em modo headless (CI/local)**:

    ```bash
    npm run test:headless
    ```

## Scripts disponíveis (`package.json`)

-   **`npm test`**: abre o Cypress Runner (`cypress open`).
-   **`npm run test:headless`**: roda toda a suíte em modo headless (`cypress run`).
-   **`npm run test:headless:login`**: executa apenas cenários marcados com
    a tag `@login`.
-   **`npm run test:headless:quotation`**: executa apenas cenários marcados com
    a tag `@quotation`.
-   **`npm run list:spec:names`**: usa `find-cypress-specs --names` para listar
    os arquivos de spec encontrados.
-   **`npm run count:by:tags`**: usa `find-cypress-specs --tags` para mostrar
    as tags presentes nas specs.
-   **`npm run cy:split:1|2|3`**: divide a execução total em três fatias usando
    as variáveis `SPLIT` e `SPLIT_INDEX` (útil para paralelizar em diferentes
    máquinas ou jobs).
-   **`npm run cy:split:all`**: executa os três splits em paralelo usando
    `concurrently`.
-   **`npm run merge-reports`**: faz o merge dos arquivos JSON gerados pelo
    `cypress-mochawesome-reporter` em `reports/html/.jsons`.
-   **`npm run generate-report`**: gera o HTML final de relatório a partir
    do JSON consolidado.
-   **`npm run post-test`**: encadeia `merge-reports` e `generate-report` após
    uma execução headless completa.

## Estrutura relevante do projeto

```
cypress/
 ├─ e2e/                 # Testes E2E (UI) - fluxos completos de interface
 │   └─ login.cy.js
 ├─ api/                 # Testes de API - validação direta de endpoints
 │   └─ quotation.cy.js
 ├─ fixtures/            # Massas de dados estáticas (ex.: users.json)
 └─ support/
     ├─ e2e.js           # Bootstrap global dos testes E2E (hooks, plugins, estilos)
     ├─ api_commands.js  # Comandos customizados para fluxos de API
     └─ gui_commands.js  # Comandos customizados para interações de UI
reports/
 └─ html/                # Saída do mochawesome (JSON, HTML, assets e screenshots)
cypress.config.js        # Configurações gerais de e2e, reporter e plugins
package.json             # Scripts e dependências do projeto
```

### Organização de testes

-   **`cypress/e2e/`**: testes end-to-end que simulam o uso da aplicação pela
    interface.

    -   Utilizam comandos como `cy.visit()`, `cy.get()`, `cy.click()`, `cy.type()`.
    -   Validam fluxos completos, como login e navegação básica.

-   **`cypress/api/`**: testes que exercitam diretamente a API.
    -   Utilizam `cy.api()` / `cy.request()` (via `cypress-plugin-api`).
    -   Validam status code, schema e dados de resposta (ex.: cotação de frete).

## Fluxo de relatórios e screenshots

### Configuração no `cypress.config.js`

-   **Reporter**: `cypress-mochawesome-reporter`.
-   **Opções principais**:
    -   `reportDir: "reports/html/"`.
    -   `embeddedScreenshots: true` para incorporar screenshots no HTML.
    -   `json: true` para gerar arquivos `.json` utilizáveis no merge posterior.
-   **Screenshots**: a pasta padrão de screenshots foi configurada como
    `screenshotsFolder: "reports/html/"`, de forma que todas as imagens fiquem
    junto dos JSON e do HTML final.

### Hook `test:after:run` em `cypress/support/e2e.js`

-   O arquivo `e2e.js` registra um listener:
    -   **Evento**: `Cypress.on('test:after:run', (test, runnable) => { ... })`.
    -   **Comportamento**:
        -   Se o teste **não** falhou (`test.state !== 'failed'`), nada é feito.
        -   Quando o teste falha, o código:
            -   Descobre o nome do arquivo de spec atual (`Cypress.spec.name`,
                por exemplo `login.cy.js`).
            -   Monta o caminho base da pasta de screenshots dentro de
                `reports/html/<specName>/`.
            -   Adiciona ao relatório mochawesome:
                -   A screenshot da última tentativa que realmente falhou:
                    `./<specName>/<suite> -- <titulo do teste> (failed).png`.
                -   (Opcionalmente) também as screenshots das tentativas
                    anteriores de retry, seguindo o padrão:
                    `(...failed) (attempt 2).png`, `(...failed) (attempt 3).png`, etc.
        -   A associação é feita usando `addContext` de `mochawesome/addContext`,
            que injeta os caminhos das imagens diretamente no contexto do teste
            dentro do relatório.

Com isso, ao abrir o HTML gerado pelo mochawesome (`merged-report.html` ou
`report-generated.html`) você consegue visualizar, para cada teste que falhou,
os screenshots correspondentes a cada tentativa, sem depender de ferramentas
externas para ajustar os caminhos.

### Passos para executar em paralelo e gerar relatório

1. **Rodar os testes em paralelo com `cypress-split`**  
   Use o script que executa todos os splits em paralelo:

    ```bash
    npm run cy:split:all
    ```

    Esse comando usa `concurrently` para disparar `cy:split:1`, `cy:split:2` e
    `cy:split:3` ao mesmo tempo, cada um rodando uma fatia diferente das specs.
    Ao final, você terá múltiplos arquivos `.json` de relatório mochawesome
    gerados em `reports/html/.jsons`, além das screenshots em `reports/html`.

2. **Merge dos relatórios e geração do HTML final**  
   Após a execução paralela, use o script que já faz o merge e gera o relatório
   final em uma única etapa:

    ```bash
    npm run post-test
    ```

    Esse comando:

    - chama internamente `merge-reports` para consolidar todos os `.json`
      gerados em um único arquivo `merged-report.json`;
    - chama `generate-report` para produzir o HTML final (por exemplo,
      `merged-report.html`) dentro de `reports/html`.

Os relatórios consolidados ficam em `reports/html` e podem ser usados em
pipelines de CI, anexados manualmente em issues ou simplesmente abertos
localmente no navegador.

## Execução filtrada por tags

Com `@cypress/grep` configurado em `cypress.config.js` e registrado em
`cypress/support/e2e.js`, é possível rodar apenas parte da suíte usando
`--env grepTags="@minha-tag"`. Os scripts `test:headless:login` e
`test:headless:quotation` já encapsulam esse uso com as tags `@login` e
`@quotation`, respectivamente, mas você pode criar novos scripts seguindo
o mesmo padrão.

## Boas práticas sugeridas

-   **Centralizar comandos**: concentre ações repetitivas em `gui_commands.js`
    e `api_commands.js`, mantendo as specs mais legíveis.
-   **Usar tags de forma consistente**: ex.: `@regressao`, `@critico`,
    `@sanidade`, `@login`, `@quotation`.
-   **Padronizar evidências**: aproveitar o hook `test:after:run` para sempre
    anexar screenshots de falhas ao relatório.
-   **Paralelizar quando possível**: usar `cypress-split` e os scripts
    `cy:split:*` para reduzir o tempo total de execução.
