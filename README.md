## 🧪 Cypress Padronização

Projeto padrão de automação de testes com Cypress para uso nos repositórios dos times. Este template demonstra boas práticas de padronização, organização e geração de relatórios automáticos.

O projeto utiliza tags, divisão de testes em paralelo e mochawesome para gerar relatórios HTML unificados, com screenshots de falha anexados automaticamente.

### 🚀 Como usar este projeto como template padrão

Este repositório serve como **guia de referência** para padronização de projetos de automação. Siga estes passos para criar um novo projeto baseado neste template:

1. **📥 Clone ou use como template**:

    - Use este repositório como base para novos projetos de automação
    - Copie a estrutura de pastas e arquivos de configuração
    - Mantenha a organização: `cypress/e2e/`, `cypress/api/`, `cypress/support/`

2. **🔧 Configure as variáveis de ambiente**:

    - Copie `cypress.env-example.json` para `cypress.env.json`
    - Preencha com as credenciais e URLs específicas do seu projeto
    - Configure secrets no GitHub Actions para CI/CD

3. **⚙️ Adapte os comandos customizados**:

    - Mantenha a estrutura de `api_commands.js` e `gui_commands.js`
    - Adapte os comandos para as necessidades específicas do seu projeto
    - Adicione novos comandos reutilizáveis conforme necessário

4. **📊 Mantenha a estrutura de relatórios**:

    - A configuração de relatórios mochawesome já está pronta
    - Os screenshots são anexados automaticamente em caso de falha
    - Use `npm run post-test` após execuções paralelas para gerar relatórios consolidados (inclui flatten de screenshots)

5. **🐳 Configure o CI/CD**:
    - Use os scripts `cy:split:*` para paralelização em pipelines
    - Configure secrets no GitHub Actions conforme documentado abaixo
    - Ajuste o workflow conforme necessário para seu ambiente

**✅ Princípios de padronização a seguir**:

-   ✅ Manter comandos customizados centralizados em `support/`
-   ✅ Usar tags consistentes para organização (`@login`, `@regressao`, etc.)
-   ✅ Seguir a estrutura de pastas: `e2e/` para UI, `api/` para endpoints
-   ✅ Gerar relatórios consolidados após execuções paralelas
-   ✅ Usar cache de sessão para melhorar performance

### ✨ Principais recursos

-   **🧪 Cypress 15 configurado**: viewport padronizado, `retries` para rodar
    novamente testes instáveis e `defaultCommandTimeout` ajustado.
-   **🔍 Suporte a `@cypress/grep`**: permite filtrar a execução por tags, tanto
    em nível de spec quanto em nível de cenário.
-   **🔀 Divisão de execuções com `cypress-split`**: facilita a paralelização em
    pipelines ou execuções distribuídas.
-   **🔧 Comandos customizados reutilizáveis** em `api_commands` e `gui_commands`
    para manter as specs mais limpas e legíveis.
-   **📈 Relatórios mochawesome em `reports/html`**, com screenshots incorporados
    e estrutura pronta para merge dos arquivos `.json`.
-   **🪝 Integração com `test:after:run`** em `cypress/support/e2e.js` para
    anexar, em cada teste que falha, as screenshots salvas pelo Cypress ao
    relatório mochawesome.

### 📋 Pré-requisitos

-   Node.js v24.11.1 (recomendado LTS).
-   npm 11.6.3 (vem com o Node mais recente).
-   Acesso ao Git e ao repositório remoto.

### 🌍 Configuração de variáveis de ambiente

1. **📋 Copie o arquivo de exemplo**:

    ```bash
    cp cypress.env-example.json cypress.env.json
    ```

2. **✏️ Preencha as variáveis** no arquivo `cypress.env.json` com suas credenciais:
    - `USER_EMAIL`: Email do usuário para testes
    - `USER_PASSWORD`: Senha do usuário
    - `PRICING_BFF_STAGING_URL`: URL da API de staging
    - `MADEIRAMADEIRA_PRODUCTION_URL`: URL de produção
    - `AUTHORIZATION_TOKEN_STAGING`: Token de autenticação (opcional)

**⚠️ Importante**: O arquivo `cypress.env.json` está no `.gitignore` e não deve ser commitado. Para GitHub Actions, configure as secrets.

### ▶️ Como executar

1. **📥 Clonar o repositório e acessar a pasta**:

    ```bash
    git clone https://github.com/<seu-usuario>/cypress-padronizacao.git
    cd cypress-padronizacao
    ```

2. **📦 Instalar dependências**:

    ```bash
    npm install
    ```

3. **🎮 Executar os testes no modo interativo**:

    ```bash
    npm test
    ```

4. **🤖 Executar os testes em modo headless (CI/local)**:

    ```bash
    npm run test:headless
    ```

## 📜 Scripts disponíveis (`package.json`)

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
-   **`npm run flatten-screenshots`**: move screenshots de subdiretórios `api` e `e2e` para o diretório raiz `reports/html/`, facilitando a organização dos arquivos.
-   **`npm run post-test`**: encadeia `flatten-screenshots`, `merge-reports` e `generate-report` após
    uma execução headless completa.

## 📁 Estrutura relevante do projeto

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

### 🗂️ Organização de testes

-   **`cypress/e2e/`**: testes end-to-end que simulam o uso da aplicação pela
    interface.

    -   Utilizam comandos como `cy.visit()`, `cy.get()`, `cy.click()`, `cy.type()`.
    -   Validam fluxos completos, como login e navegação básica.

-   **`cypress/api/`**: testes que exercitam diretamente a API.
    -   Utilizam `cy.api()` / `cy.request()` (via `cypress-plugin-api`).
    -   Validam status code, schema e dados de resposta (ex.: cotação de frete).

### ❓ Como decidir onde colocar um teste?

Use estas perguntas para ajudar na decisão:

1. **🌐 O teste precisa abrir um navegador?**

    - ✅ Sim → `cypress/e2e/`
    - ❌ Não → `cypress/api/`

2. **👁️ O teste interage com elementos visuais?**

    - ✅ Sim → `cypress/e2e/`
    - ❌ Não → `cypress/api/`

3. **🔌 O teste valida apenas a resposta de uma API?**

    - ✅ Sim → `cypress/api/`
    - ❌ Não → `cypress/e2e/`

4. **👤 O teste simula um fluxo completo do usuário?**
    - ✅ Sim → `cypress/e2e/`
    - ❌ Não → Considere `cypress/api/`

## 📋 Fluxo de relatórios e screenshots

### ⚙️ Configuração no `cypress.config.js`

-   **Reporter**: `cypress-mochawesome-reporter`.
-   **Opções principais**:
    -   `reportDir: "reports/html/"`.
    -   `embeddedScreenshots: true` para incorporar screenshots no HTML.
    -   `json: true` para gerar arquivos `.json` utilizáveis no merge posterior.
-   **🖼️ Screenshots**: a pasta padrão de screenshots foi configurada como
    `screenshotsFolder: "reports/html/"`, de forma que todas as imagens fiquem
    junto dos JSON e do HTML final.

### 🪝 Hook `test:after:run` em `cypress/support/e2e.js`

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

### 🔄 Passos para executar em paralelo e gerar relatório

1. **🔀 Rodar os testes em paralelo com `cypress-split`**  
   Use o script que executa todos os splits em paralelo:

    ```bash
    npm run cy:split:all
    ```

    Esse comando usa `concurrently` para disparar `cy:split:1`, `cy:split:2` e
    `cy:split:3` ao mesmo tempo, cada um rodando uma fatia diferente das specs.
    Ao final, você terá múltiplos arquivos `.json` de relatório mochawesome
    gerados em `reports/html/.jsons`, além das screenshots em `reports/html`.

2. **🔗 Merge dos relatórios e geração do HTML final**  
   Após a execução paralela, use o script que já faz o merge e gera o relatório
   final em uma única etapa:

    ```bash
    npm run post-test
    ```

    Esse comando:

    - chama internamente `flatten-screenshots` para organizar screenshots de subdiretórios `api` e `e2e` no diretório raiz `reports/html/`;
    - chama `merge-reports` para consolidar todos os `.json`
      gerados em um único arquivo `merged-report.json`;
    - chama `generate-report` para produzir o HTML final (por exemplo,
      `merged-report.html`) dentro de `reports/html`.

Os relatórios consolidados ficam em `reports/html` e podem ser usados em
pipelines de CI, anexados manualmente em issues ou simplesmente abertos
localmente no navegador.

## 🏷️ Execução filtrada por tags

Com `@cypress/grep` configurado em `cypress.config.js` e registrado em
`cypress/support/e2e.js`, é possível rodar apenas parte da suíte usando
`--env grepTags="@minha-tag"`. Os scripts `test:headless:login` e
`test:headless:quotation` já encapsulam esse uso com as tags `@login` e
`@quotation`, respectivamente, mas você pode criar novos scripts seguindo
o mesmo padrão.

## 💾 Cache de sessão com `cy.session`

O projeto utiliza `cy.session` para cachear sessões de login entre testes, melhorando significativamente a performance. O comando `cy.gui_login` suporta cache através do parâmetro `cacheSession` (padrão: `true`).

### ✅ Como validar que o cache está funcionando

**📝 Observando os logs do Cypress:**

-   **Primeira execução (cria sessão):**

    ```
    ✓ Saved session: user@example.com
    ```

-   **Execuções subsequentes (reutiliza sessão):**
    ```
    ✓ Restored session: user@example.com
    ```

**⏱️ Teste comparativo de tempo:**

Execute testes com e sem cache para comparar a diferença de performance:

```javascript
cy.gui_login(user, password, { cacheSession: false }) // Sem cache
cy.gui_login(user, password, { cacheSession: true }) // Com cache
```

O tempo com cache deve ser significativamente menor quando a sessão é reutilizada.

**🔄 Validação entre specs diferentes:**

Com `cacheAcrossSpecs: true` configurado, a sessão pode ser reutilizada entre specs diferentes. Execute múltiplos specs em sequência e observe nos logs se aparece "Restored session" ao invés de "Saved session".

### 🔧 Troubleshooting

-   **Sempre cria nova sessão**: Verifique se `cacheSession: true` está sendo usado e se a função `validate` não está falhando.
-   **Sessões se misturam entre usuários**: O `sessionId` é baseado no email do usuário, garantindo isolamento por usuário.

## ⭐ Boas práticas sugeridas

-   **🔧 Centralizar comandos**: concentre ações repetitivas em `gui_commands.js`
    e `api_commands.js`, mantendo as specs mais legíveis.
-   **🏷️ Usar tags de forma consistente**: ex.: `@regressao`, `@critico`,
    `@sanidade`, `@login`, `@quotation`.
-   **📸 Padronizar evidências**: aproveitar o hook `test:after:run` para sempre
    anexar screenshots de falhas ao relatório.
-   **⚡ Paralelizar quando possível**: usar `cypress-split` e os scripts
    `cy:split:*` para reduzir o tempo total de execução.
-   **💾 Usar cache de sessão**: aproveitar `cy.session` para reduzir tempo de execução em testes que requerem autenticação.

## 🐙 GitHub Actions / CI/CD

O projeto inclui um workflow básico do GitHub Actions (`.github/workflows/cypress.yml`) que executa os testes automaticamente em push.

### 🔑 Configuração de Secrets no GitHub

Para que os testes funcionem no GitHub Actions, é necessário configurar as seguintes secrets no repositório:

1. Acesse: **Settings** → **Secrets and variables** → **Actions**
2. Adicione cada uma das seguintes secrets:
    - `USER_EMAIL`
    - `USER_PASSWORD`
    - `PRICING_BFF_STAGING_URL`
    - `MADEIRAMADEIRA_PRODUCTION_URL`
    - `AUTHORIZATION_TOKEN_STAGING`

## 📌 Notas importantes

-   **Testes intencionalmente falhos**: Alguns testes nas specs de exemplo (`login.cy.js` e `quotation.cy.js`) são intencionalmente falhos para demonstrar retries e screenshots no relatório. Eles estão marcados com a tag `@example-fail` e podem ser filtrados em pipelines reais.
-   **Variáveis de ambiente**: Nunca commite o arquivo `cypress.env.json` com credenciais reais. Use `cypress.env-example.json` como template e configure secrets no GitHub Actions.
