# AeroCode System - AV1

## Nome da atividade e desafio

**Atividade:** desenvolvimento do primeiro produto da AeroCode para gestão de produção de aeronaves.

**Desafio proposto (assets/atividade.md):** construir um sistema **CLI (Command-Line Interface)** em TypeScript para simular o processo completo de produção de uma aeronave, incluindo:

- cadastro e listagem de aeronaves;
- gerenciamento de peças e seus status;
- gerenciamento de etapas de produção com ordem lógica;
- cadastro de funcionários com autenticação e níveis de permissão;
- registro de testes técnicos;
- geração de relatório final em arquivo texto;
- persistência dos dados em arquivos locais.

## Pré-requisitos

Tecnologias utilizadas no projeto:

- **Node.js:** `>=20.11.1 <23` (conforme `engines` do projeto)
- **npm:** `10.9.0` (conforme `packageManager` do projeto)
- **TypeScript:** compilação com `tsc`

Verificando versões instaladas:

```bash
node -v
npm -v
npx tsc -v
```

## Como inicializar o projeto

No diretório raiz do projeto, execute:

1. Instalar dependências:

```bash
npm i
```

2. Compilar o TypeScript para JavaScript:

```bash
npx tsc
```

Ou:

```bash
npm run build
```

3. Iniciar o sistema:

```bash
npm start
```

Ou:

```bash
npm run start
```

## Como usar no terminal

Ao iniciar, o sistema abre no terminal e solicita autenticação:

- `Usuário:`
- `Senha:`

### Usuário padrão para login

O sistema possui um funcionário cadastrado por padrão:

- **Usuário:** `admin`
- **Senha:** `aerocode123`

Depois do login, o menu principal é exibido com opções de gerenciamento de:

- Aeronaves
- Funcionários

Dentro de **Aeronaves**, você consegue:

- listar aeronaves;
- cadastrar aeronave;
- gerenciar uma aeronave específica por código;
- cadastrar/listar peças, etapas e testes;
- atualizar status de peças e etapas;
- gerar e visualizar relatório final.

### Exemplo rápido de execução

```text
$ npm start
Bem-vindo ao sistema de gerenciamento da AeroCode

-------------------
Login do Sistema
-------------------
Usuário: admin
Senha: aerocode123

-------------------
Menu Principal
-------------------
1 - Aeronaves
2 - Funcionários
0 - Sair
```

### Fluxo sugerido para testar funcionalidades

1. Fazer login.
2. Ir em `1 - Aeronaves`.
3. Cadastrar uma aeronave (`2 - Cadastrar Aeronave`).
4. Entrar em `3 - Gerenciar Aeronaves` e informar o código da aeronave criada.
5. Cadastrar peças, etapas e testes.
6. Concluir etapas na ordem correta.
7. Gerar o relatório final.

## Estrutura do projeto

```text
aerocode-system-av1/
├─ assets/
│  └─ atividade.md
├─ src/
│  ├─ app/
│  │  └─ main.ts
│  ├─ io/
│  │  ├─ entrada.ts
│  │  └─ persistencia.ts
│  ├─ modelo/
│  │  ├─ classes/
│  │  │  ├─ Aeronave.ts
│  │  │  ├─ Peca.ts
│  │  │  ├─ Etapa.ts
│  │  │  ├─ Funcionario.ts
│  │  │  ├─ Teste.ts
│  │  │  └─ Relatorio.ts
│  │  └─ enums/
│  ├─ negocio/
│  │  ├─ cadastro.ts
│  │  ├─ listagem.ts
│  │  ├─ Aeronave/
│  │  ├─ Peca/
│  │  ├─ Etapa/
│  │  ├─ Funcionario/
│  │  ├─ Teste/
│  │  └─ Relatorio/
│  └─ permissoes/
│     ├─ permissoes.ts
│     └─ sessao.ts
├─ output/              # JavaScript gerado pelo compilador TypeScript
├─ storage/             # Persistência local em JSON/txt
├─ package.json
└─ tsconfig.json
```

## Conceitos aprendidos/aplicados

Pensando na disciplina de Técnica de Programação (início com POO em TypeScript/JavaScript), o projeto aplica os seguintes conceitos principais:

- **Classes e objetos:** modelagem de entidades de domínio como `Aeronave`, `Peca`, `Etapa`, `Funcionario`, `Teste` e `Relatorio`.
- **Encapsulamento:** uso de atributos privados em pontos críticos (ex.: relatório e coleções internas da aeronave), com acesso por métodos específicos.
- **Abstração e herança:** classes abstratas `Cadastro` e `Listagem` definem contratos base, implementados pelas classes concretas de cada módulo.
- **Polimorfismo:** mesma operação conceitual (`cadastrar()` e `listar()`) com comportamentos diferentes dependendo da classe concreta utilizada.
- **Interfaces e tipagem estática:** interfaces de persistência (`FuncionarioJson`, `PecaJson`, `EtapaJson`, `TesteJson`, `RelatorioJson`, `AeronaveJson`) garantem contrato de dados na serialização JSON.
- **Regras de negócio e validação:** controle de duplicidade, ordem lógica de etapas, validação de permissões e pré-requisitos para gerar relatório final.
