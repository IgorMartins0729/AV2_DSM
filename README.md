# README - Manual de Instalação e Execução do Projeto React

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado em sua máquina:

* Node.js versão 22.19.0
* npm (geralmente já vem com o Node.js)
* Git (opcional, para clonar o repositório)

Para verificar a versão instalada do Node.js, execute:

```bash id="aj54m7"
node -v
```

---

## Clonando o Projeto

Caso o projeto esteja em um repositório GitHub, execute:

```bash id="q3c0gj"
git clone URL_DO_REPOSITORIO
```

Depois acesse a pasta do projeto:

```bash id="kqrb75"
cd NOME_DO_PROJETO
```

---

## Instalando as Dependências

No terminal, execute:

```bash id="43lm1k"
npm install
```

Esse comando irá instalar todas as dependências presentes no arquivo `package.json`.

---

## Executando o Projeto

Após a instalação das dependências, execute:

```bash id="d6w4m8"
npm run dev
```

ou, dependendo da configuração do projeto:

```bash id="w5s4s0"
npm start
```

---

## Acessando no Navegador

Após iniciar o servidor, o terminal mostrará uma URL semelhante a:

```bash id="8jccq0"
http://localhost:5173
```

ou

```bash id="22f7wq"
http://localhost:3000
```

Abra essa URL no navegador para visualizar o projeto.

---

## Possíveis Problemas

### Erro: “npm não é reconhecido”

Verifique se o Node.js foi instalado corretamente:

```bash id="4j4ikf"
node -v
npm -v
```

---

### Erro ao instalar dependências

Tente limpar o cache do npm:

```bash id="kruovg"
npm cache clean --force
```

E depois execute novamente:

```bash id="snk3lu"
npm install
```

---

## Estrutura Básica do Projeto

```bash id="rl49s5"
src/
 ├── components/
 ├── pages/
 ├── assets/
 ├── App.jsx
 └── main.jsx
```

---

## Tecnologias Utilizadas

* React
* JavaScript
* CSS
* Vite / Create React App

---

## Desenvolvedor

Projeto desenvolvido por Igor Martins.

