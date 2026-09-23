# unioff

## Objetivo do Sistema

O Unioff é uma plataforma de benefícios estudantis que conecta estudantes a estabelecimentos parceiros. O sistema permite que lojas cadastrem e divulguem promoções, descontos e benefícios exclusivos para alunos. Os estudantes podem pesquisar ofertas, visualizar detalhes dos benefícios e realizar resgates por meio da plataforma. O objetivo é facilitar o acesso a vantagens estudantis e aumentar a visibilidade dos estabelecimentos participantes, criando uma relação vantajosa para ambos os lados.


## Integrantes

| Nome | Papel |
|--------|--------|
| Gabriel Ribeiro Irala | Full Stack |
| Leonardo Barreto | Full Stack |
| Marcos Aurélio Santos | Full Stack |
| Marcelo Eugênio Campos | Full Stack |

---

## Tecnologias Utilizadas

### Linguagens

- Java
- JavaScript
  
### Frameworks e Bibliotecas

- Spring Boot
- Spring Security
- Next.js
- React
- Tailwind CSS

### Banco de Dados

- PostgreSQL

### Ferramentas e Agentes de IA

- Antigravity
- Codex

---

## Funcionalidades Previstas

- Cadastro e autenticação de estudantes
- Cadastro e autenticação de estabelecimentos
- Gerenciamento de benefícios e promoções
- Busca e filtragem de ofertas
- Resgate de benefícios
- Painel administrativo para gerenciamento da plataforma


## Arquitetura do Sistema

O sistema utiliza uma arquitetura em camadas, promovendo a separação de responsabilidades e facilitando a manutenção e evolução da aplicação.

### Backend

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Banco de Dados (PostgreSQL)
```

## Entidades

### 1. Usuário
Classe base de autenticação (Spring Security). Implementa `UserDetails` diretamente.

| Atributo | Tipo (Java)   | Descrição | Regras |
|---|---------------|---|---|
| `id` | UUID          | Identificador único | PK, autoincremento |
| `nome` | String        | Nome do usuário | Obrigatório |
| `email` | String        | E-mail para login | Obrigatório, Único |
| `senhaHash` | String        | Senha criptografada (BCrypt) | Obrigatório, nunca serializado em resposta |
| `tipoUsuario` | Enum          | ESTUDANTE, EMPRESA, ADMIN | Obrigatório |
| `ativo` | boolean       | Conta ativa/desativada | Default: true |
| `dataCriacao` | LocalDateTime | Data de criação da conta | Preenchido automaticamente |

### 2. Estudante
Relacionamento 1:1 com `Usuario`, ID compartilhado via `@MapsId`.

| Atributo | Tipo (Java) | Descrição | Regras |
|---|-------------|---|---|
| `id` | UUID        | Mesmo ID do `Usuario` | PK e FK (via `@MapsId`) |
| `instituicao` | String      | Nome da universidade | Obrigatório |
| `curso` | String      | Curso do estudante | Opcional |
| `matricula` | String      | Número de matrícula | Opcional, **sem restrição de unicidade** |
| `usuario` | Usuario     | Referência de navegação para dados de login | `@OneToOne @MapsId` |

### 3. Empresa (Estabelecimento)
Relacionamento 1:1 com `Usuario`, ID compartilhado via `@MapsId`.

| Atributo | Tipo (Java)     | Descrição | Regras |
|---|-----------------|---|---|
| `id` | UUID            | Mesmo ID do `Usuario` | PK e FK (via `@MapsId`) |
| `nomeFantasia` | String          | Nome público da loja | Obrigatório |
| `descricao` | String          | Descrição do estabelecimento | Opcional |
| `cidade` | String          | Cidade | Obrigatório |
| `bairro` | String          | Bairro | Obrigatório |
| `logradouro` | String          | Rua/avenida | Obrigatório |
| `numero` | String          | Número do endereço | Obrigatório |
| `telephoneWhatsapp` | String          | Contato via WhatsApp | Opcional |
| `site` | String          | Site da empresa | Opcional |
| `usuario` | Usuario         | Referência de navegação para dados de login | `@OneToOne @MapsId` |
| `beneficios` | List<Beneficio> | Ofertas cadastradas | `@OneToMany(mappedBy = "empresa")` |

### 4. Benefício

| Atributo                 | Tipo (Java) | Descrição | Regras |
|--------------------------|-------------|---|---|
| `id`                     | UUID        | Identificador único | PK, autoincremento |
| `titulo`                 | String      | Nome do benefício | Obrigatório |
| `descricao`              | String      | Detalhes do benefício | Opcional |
| `dataInicio`             | LocalDate   | Início da validade | Opcional |
| `dataFim`                | LocalDate   | Fim da validade | Opcional |
| `quantidadeResgates`     | Integer     | Contador de resgates realizados | Default: 0 |
| `quantidadeMaxResgastes` | Integer     | Limite total de resgates | Obrigatório, > 0 |
| `ativo`                  | boolean     | Exclusão lógica | Default: true |
| `empresa`                | Empresa     | Dona do benefício | `@ManyToOne`, obrigatório |
| `cupons`                 | List<Cupom> | Resgates realizados para este benefício | `@OneToMany(mappedBy = "beneficio")` |

### 5. Cupom
| Atributo | Tipo (Java)   | Descrição | Regras |
|---|---------------|---|---|
| `id` | UUID          | Identificador único | PK, autoincremento |
| `codigoCupom` | String        | Código único do cupom gerado | Obrigatório, Único |
| `dataResgate` | LocalDateTime | Quando o estudante resgatou | Preenchido automaticamente |
| `utilizado` | boolean       | Se o cupom já foi validado pela empresa | Default: false |
| `estudante` | Estudante     | Quem gerou o cupom | `@ManyToOne`, obrigatório |
| `beneficio` | Beneficio     | Qual benefício foi resgatado | `@ManyToOne`, obrigatório |

## Repository

### UsuarioRepository
| Método | Descrição |
|---|---|
| `findByEmail(String email)` | Busca um usuário pelo e-mail. Usado no login (`AuthService.autenticar`) e pelo `JwtAuthenticationFilter` para carregar o usuário autenticado a partir do e-mail extraído do token |
| `existsByEmail(String email)` | Verifica duplicidade de e-mail antes de qualquer cadastro (estudante ou empresa) |

### EstudanteRepository
Sem métodos customizados.

### EmpresaRepository
| Método | Descrição |
|---|---|
| `findByUsuarioEmail(String email)` | Busca a empresa a partir do e-mail do usuário logado, atravessando o relacionamento `Empresa → Usuario`. Usado nas rotas `/api/empresas/me/**` |
| `findByFiltros(nome, cidade, bairro, Pageable)` | Filtros opcionais (só aplicados se não forem `null`) para a listagem pública paginada de empresas (`GET /api/empresas`) |

### BeneficioRepository
| Método | Descrição |
|---|---|
| `findBeneficiosDaEmpresa(email, ativo, esgotado, Pageable)` | Localiza os benefícios de uma empresa pelo e-mail do usuário dono, com filtros opcionais de status (`ativo`) e esgotamento (`quantidadeResgates` vs `quantidadeMaxResgastes`). Usado em `GET /api/empresas/me/beneficios` |

### CupomRepository
| Método | Descrição |
|---|---|
| `findByEstudanteIdOrderByDataGeracaoDesc(UUID estudanteId)` | Histórico de cupons de um estudante, do mais recente para o mais antigo. Usado em `GET /api/resgates/me` |
| `countCuponsPorBeneficioStatus(empresaId, status)` | Conta cupons agrupados por benefício e status (`GROUP BY`), retornando pares `beneficioId`/contagem. Usado no cálculo de métricas da empresa (`GET /api/empresas/me/metricas`) |

### Frontend (a definir)
---

## Histórias de usuários

- COMO ESTUDANTE, QUERO criar uma conta na plataforma,PARA acessar os beneficios oferecidos pelas empresas parceiras.
- COMO EMPRESA, QUERO criar uma conta na plataforma, PARA cadastrar meu estabelecimento e divulgar beneficios.
- COMO EMPRESA, QUERO cadastrar meu estabelecimento, PARA divulgar meus beneficios aos estudantes.
- COMO USUARIO, QUERO realizar login na plataforma.
- COMO ESTUDANTE, QUERO visualizar os detalhes de uma empresa, PARA conhecer os beneficios, a localizacao e as formas de contato.
- COMO EMPRESA, QUERO atualizar minhas informacoes.
- COMO ESTUDANTE, QUERO visualizar os beneficios disponiveis, PARA encontrar descontos do meu interesse.
- COMO ESTUDANTE, QUERO pesquisar beneficios por nome da empresa ou beneficio, PARA encontrar ofertas rapidamente.
- COMO EMPRESA, QUERO cadastrar beneficios, PARA atrair novos estudantes para meu estabelecimento.
- COMO EMPRESA, QUERO editar beneficios.
- COMO EMPRESA,QUERO remover beneficios.
- COMO ESTUDANTE, QUERO resgatar um beneficio, PARA utiliza-lo em um estabelecimento parceiro.
- COMO ESTUDANTE, QUERO visualizar meu historico de resgates, PARA acompanhar os beneficios que ja utilizei.
- COMO EMPRESA, QUERO validar um cupom resgatado, PARA garantir que o beneficio seja utilizado apenas uma vez.
- COMO EMPRESA, QUERO visualizar quantos beneficios foram resgatados, PARA acompanhar o impacto da plataforma no meu negocio.
- COMO ADMINISTRADOR, QUERO desativar empresas ou beneficios que violem as regras, PARA manter a confiabilidade da plataforma.



