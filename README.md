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

| Atributo | Tipo (Java) | Descrição | Regras |
|---|---|---|---|
| `id` | UUID | Identificador único | PK, gerado automaticamente |
| `email` | String | E-mail para login | Obrigatório, Único |
| `senha` | String | Senha criptografada (BCrypt) | Obrigatório, nunca serializado em DTO/response |
| `tipoPerfil` | Enum | ESTUDANTE, EMPRESA | Obrigatório |
| `ativo` | boolean | Conta ativa/desativada pelo admin | Default: true |
> `getAuthorities()` retorna `ROLE_` + `tipoPerfil`.
> `isEnabled()` retorna o campo `ativo`.
> Desativar um usuário (via admin) desativa tanto o estudante quanto a empresa vinculada — não há campo `ativo` duplicado nas entidades filhas.
---
### 2. Estudante
Relacionamento 1:1 com `Usuario`, ID compartilhado via `@MapsId`.

| Atributo | Tipo (Java) | Descrição | Regras |
|---|---|---|---|
| `id` | UUID | Mesmo UUID do `Usuario` | PK e FK (via `@MapsId`) |
| `nomeEstudante` | String | Nome real do aluno | Obrigatório |
| `matricula` | String | Número de matrícula | Obrigatório, Único |
| `instituicao` | String | Nome da universidade | Obrigatório |
| `endereco` | String | Endereço do estudante | Opcional |
| `usuario` | Usuario | Referência de navegação para dados de login | `@OneToOne @MapsId` |
---
### 3. Empresa (Estabelecimento)
Relacionamento 1:1 com `Usuario`, ID compartilhado via `@MapsId`. Cada unidade/franquia é cadastrada como uma `Empresa` própria (1 CNPJ = 1 Empresa).

| Atributo | Tipo (Java) | Descrição | Regras |
|---|---|---|---|
| `id` | UUID | Mesmo UUID do `Usuario` | PK e FK (via `@MapsId`) |
| `nomeFantasia` | String | Nome público da loja | Obrigatório |
| `cnpj` | String | CNPJ da empresa | Obrigatório, Único |
| `endereco` | String | Endereço físico da unidade | Obrigatório |
| `usuario` | Usuario | Referência de navegação para dados de login | `@OneToOne @MapsId` |
| `beneficios` | List<Beneficio> | Ofertas cadastradas | `@OneToMany(mappedBy = "empresa")`, sem cascade

### 4. Benefício
| Atributo        | Tipo (Java) | Descrição | Regras |
|:----------------|:------------| :--- | :--- |
| `id`            | UUID        | Identificador único | Chave Primária (PK) |
| `titulo`        | String      | Nome do benefício (ex: "20% de desconto no lanche") | Obrigatório |
| `descricao`     | String      | Detalhes/condições de uso do benefício | Obrigatório |
| `tipoDesconto`  | Enum        | PERCENTUAL, VALOR_FIXO, BRINDE | Obrigatório |
| `valorDesconto` | BigDecimal  | Valor numérico associado ao tipo (percentual ou valor fixo) | Opcional (nulo quando `tipoDesconto` = BRINDE) |
| `dataInicio`    | LocalDate   | Data de início da validade da promoção | Opcional |
| `dataFim`       | LocalDate   | Data limite de validade da promoção | Opcional |
| `ativo`         | boolean     | Define se o benefício está disponível/visível para os estudantes | Default: `true` |
| `empresa`       | Empresa     | Estabelecimento dono do benefício | Relacionamento `@ManyToOne`, obrigatório |
| `cupom`         | List<Cupom> | Cupons gerados por estudantes para este benefício | Relacionamento `@OneToMany(mappedBy = "beneficio")` |

### 5. Cupom
| Atributo | Tipo (Java) | Descrição | Regras |
|---|---|---|---|
| `id` | UUID | Identificador único | PK |
| `codigo` | String | Código único do cupom | Obrigatório, Único |
| `status` | Enum | PENDENTE, USADO, EXPIRADO | Default: PENDENTE |
| `dataGeracao` | LocalDateTime | Quando o estudante gerou o cupom | Obrigatório |
| `dataUso` | LocalDateTime | Quando a empresa validou o cupom | Opcional |
| `estudante` | Estudante | Quem gerou o cupom | `@ManyToOne`, obrigatório |
| `beneficio` | Beneficio | Qual benefício foi resgatado | `@ManyToOne`, obrigatório |

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



