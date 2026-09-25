# Unioff — frontend

Next.js 16 (App Router) + React 19 + Tailwind CSS 4.

## Como rodar

1. Suba o backend (`unioff-backend`) na porta 8080.
2. Aqui na pasta do frontend:

```bash
npm install
npm run dev
```

3. Abra http://localhost:3000.

Contas de teste criadas pelo `DataInitializer` do backend:

- Estudante: `estudante@teste.com` / `senha123`
- Empresa: `empresa@teste.com` / `senha123`

## Integração com o backend

O `next.config.ts` faz proxy de `/api/*` para o backend, então o navegador só
fala com a origem do frontend e não é preciso configurar CORS no Spring. Para
apontar para outro endereço, defina `BACKEND_URL` (padrão `http://localhost:8080`).

O token JWT do login fica no `localStorage` e vai no header `Authorization`
de cada requisição (`lib/http.ts`). Se o backend responder 401, a sessão é encerrada.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `lib/types.ts` | Tipos que espelham os DTOs do backend |
| `lib/http.ts` | Cliente HTTP, token e tratamento de erros |
| `lib/api.ts` | Uma função por endpoint |
| `lib/auth.tsx` | Sessão do usuário (login, logout, perfil) |
| `components/` | Componentes reutilizáveis (cupom, formulários, tabela) |
| `app/` | Páginas (rotas do App Router) |

## Telas

| Rota | Perfil | História de usuário |
| --- | --- | --- |
| `/` | todos | Visualizar e pesquisar benefícios |
| `/beneficios/[id]` | todos / estudante | Ver detalhes e resgatar benefício |
| `/empresas/[id]` | todos | Ver detalhes, localização e contato da empresa |
| `/login`, `/cadastro` | visitante | Criar conta (estudante ou empresa) e fazer login |
| `/meus-cupons` | estudante | Histórico de resgates |
| `/painel` | empresa | Métricas, listar e desativar benefícios |
| `/painel/beneficios/novo`, `/painel/beneficios/[id]` | empresa | Cadastrar e editar benefícios |
| `/painel/validar` | empresa | Validar cupom resgatado |
| `/painel/perfil` | empresa | Atualizar dados do estabelecimento |
