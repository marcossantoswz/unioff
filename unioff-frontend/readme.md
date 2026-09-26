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
| `lib/types.ts` | Modelo usado pelas telas |
| `lib/normalizar.ts` | Converte respostas da API para o modelo |
| `lib/http.ts` | Cliente HTTP, token e tratamento de erros |
| `lib/api.ts` | Uma função por endpoint |
| `lib/auth.tsx` | Sessão do usuário (login, logout, perfil) |
| `components/` | Componentes reutilizáveis (cupom, formulários, tabela) |
| `app/` | Páginas (rotas do App Router) |

## Visual

Paleta [gruvbox](https://github.com/morhetz/gruvbox) na variante clara. As cores ficam em variáveis
no `app/globals.css`; para trocar de tema, basta mudar os valores de `:root`.

## Telas

| Rota | Perfil | História de usuário |
| --- | --- | --- |
| `/` | todos | Home com busca, destaques e empresas parceiras |
| `/beneficios` | todos | Visualizar e pesquisar benefícios |
| `/beneficios/[id]` | todos / estudante | Ver detalhes e resgatar benefício |
| `/empresas` | todos | Listar empresas por nome e cidade |
| `/empresas/[id]` | todos | Ver detalhes, localização e contato da empresa |
| `/login`, `/cadastro` | visitante | Criar conta (estudante ou empresa) e fazer login |
| `/estudante/me` | estudante | Conta e cupons prontos para usar |
| `/estudante/me/resgates` | estudante | Histórico de resgates |
| `/empresa/me` | empresa | Métricas e atualização dos dados do estabelecimento |
| `/empresa/me/beneficios` | empresa | Listar e desativar benefícios |
| `/empresa/me/beneficios/novo`, `/empresa/me/beneficios/[id]` | empresa | Cadastrar e editar benefícios |
| `/empresa/me/resgates` | empresa | Validar cupom e listar cupons resgatados |

`/admin` fica para depois: o backend ainda não tem os endpoints de administração.

## Compatibilidade com a especificação

`lib/normalizar.ts` converte as respostas da API para o modelo das telas. Ele aceita tanto o
formato atual do backend (`codigo`, `status`, `nomeEmpresa`) quanto o da especificação
(`codigoCupom`, `utilizado`, `empresa.nomeFantasia`), então o front não quebra se o backend mudar.
