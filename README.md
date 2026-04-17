# Bismak Life Manager 🚀

Um aplicativo completo focado em organização pessoal, rotina diária, controle de ganhos (Uber) e metas.

## ✨ Funcionalidades

- **Dashboard Inteligente**: Resumo do dia, próxima atividade e lucro Uber.
- **Cronograma Diário**: Gerenciamento de tarefas com categorias (Trabalho, Uber, Família, Estudo).
- **Controle Uber**: Cálculo automático de lucro (Ganhos - Combustível - Taxas) com histórico e gráfico de evolução.
- **Gestão de Metas**: Acompanhamento visual de progresso e prazos.
- **Planejamento Semanal**: Tabela estilo calendário para organização macro.
- **Autenticação**: Login simples para proteção de dados.
- **Backend Integrado**: Servidor Node.js com banco de dados SQLite.
- **Pronto para SaaS**: Estrutura modular e endpoints para n8n/webhooks.

## 🛠️ Tecnologias

- **Frontend**: React, Vite, TypeScript, Tailwind CSS (v4), Lucide React, Recharts.
- **Backend**: Node.js, Express, Better-SQLite3.
- **Estilo**: Design Premium Dark (Azul #0A2540 e Preto).

## 🚀 Como Rodar

1.  **Instalar dependências**:
    ```bash
    npm install
    ```

2.  **Rodar o projeto (Frontend + Backend simultaneamente)**:
    ```bash
    npm run dev
    ```

3.  **Acesse no navegador**:
    - URL: `http://localhost:5173`
    - **Login**: `admin@bismak.com`
    - **Senha**: `admin123`

## 🔌 Integração n8n

O backend possui um endpoint de webhook pronto para receber automações:
`POST http://localhost:5000/api/webhook/n8n`

---

Desenvolvido com foco em alta performance e design premium.
