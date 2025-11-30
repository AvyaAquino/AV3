# ✈️ AeroCode Web System

Sistema de Gestão de Produção de Aeronaves desenvolvido como parte das Atividades Avaliativas (AV2 e AV3). Este projeto migra um sistema legado (CLI) para uma arquitetura web moderna, escalável e segura, classificada como **Sistema Crítico**.

## 📋 Sobre o Projeto

O AeroCode permite que grandes fabricantes (Boeing, Airbus, Embraer, etc.) gerenciem o ciclo de vida da produção de aeronaves. O sistema controla desde o cadastro da aeronave, passando pela gestão de peças e etapas de montagem, até a realização de testes de qualidade e geração de relatórios finais de entrega.

### 🚀 Tecnologias Utilizadas

**Front-end (`aero-gui`):**
* **React** (Vite + TypeScript)
* **Ant Design** (Biblioteca de UI Profissional)
* **Axios** (Comunicação HTTP)
* **React Router v6** (Navegação SPA)
* **Context API** (Gerenciamento de Estado Global)

**Back-end (`aero-api`):**
* **Node.js** com **Express**
* **TypeScript**
* **Prisma ORM** (Modelagem e Migrations)
* **MySQL** (Banco de Dados Relacional)
* **Performance Monitor** (Middleware customizado para métricas de latência)

---

## ⚙️ Pré-requisitos

* Node.js (v18 ou superior)
* MySQL Server instalado e rodando

---

## 🛠️ Instalação e Execução

Este projeto é dividido em duas partes: API (Back-end) e GUI (Front-end). Siga a ordem abaixo:

### 1. Configurando o Back-end (`aero-api`)

1.  Acesse a pasta da API:
    ```bash
    cd aero-api
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure o Banco de Dados:
    * Crie um arquivo `.env` na raiz de `aero-api`.
    * Adicione a string de conexão com seu usuário e senha do MySQL:
    ```env
    DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/aerocode_db"
    ```
4.  Crie as tabelas no banco (Migrations):
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Popule o banco com dados iniciais (Seed):
    ```bash
    npx prisma db seed
    ```
6.  Inicie o servidor:
    ```bash
    npm run dev
    ```
    *O servidor rodará em: `http://localhost:3000`*

### 2. Configurando o Front-end (`aero-gui`)

1.  Abra um **novo terminal** e acesse a pasta da interface:
    ```bash
    cd aero-gui
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação:
    ```bash
    npm run dev
    ```
4.  Acesse no navegador: `http://localhost:5173`

---

## 🔑 Acesso ao Sistema

Utilize as credenciais criadas pelo *seed* do banco de dados:

| Usuário | Senha | Nível | Permissões |
| :--- | :--- | :--- | :--- |
| `admin` | `admin` | **Administrador** | Acesso total + Gestão de Funcionários |
| `eng` | `123` | **Engenheiro** | Gestão de Aeronaves, Peças, Etapas e Testes |
| `op` | `123` | **Operador** | Visualização e execução de tarefas |

---

## 🧪 Testes de Carga e Qualidade (Requisito AV3)

Para gerar o **Relatório de Qualidade**, o sistema possui um script automatizado que simula múltiplos usuários simultâneos e mede Latência, Tempo de Processamento e Tempo de Resposta.

1.  Com o servidor rodando, abra um terminal na pasta `aero-api`.
2.  Execute o script de teste:
    ```bash
    npx tsx test/load-test.ts
    ```
3.  O terminal exibirá as métricas para 1, 5 e 10 usuários simultâneos.

---

## 🛡️ Funcionalidades Implementadas

* [x] **Autenticação Segura:** Login validado no banco de dados.
* [x] **Controle de Acesso (RBAC):** Menus e rotas protegidas por nível de permissão.
* [x] **CRUD Completo:** Aeronaves, Funcionários, Peças, Etapas e Testes.
* [x] **Regras de Negócio:**
    * Impedir avanço de etapa se a anterior não estiver concluída.
    * Validação de unicidade de códigos.
* [x] **Relatórios:** Geração de relatório de entrega em formato texto.
* [x] **Observabilidade:** Middleware de métricas de performance no servidor.

---