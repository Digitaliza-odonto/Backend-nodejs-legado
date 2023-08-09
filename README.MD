# Documentação da API Prontuário-UFPel

Esta documentação descreve a API "Prontuário-UFPel", que é usada para gerenciar informações de pacientes e encaminhamentos médicos. A API utiliza o framework Express.js para lidar com as requisições HTTP e se comunica com um banco de dados utilizando o módulo "db".

## Índice

1. [Configuração do Servidor](#configuracao-do-servidor)
2. [Pacientes](#pacientes)
   1. [Criar Paciente](#criar-paciente)
   2. [Consultar Paciente](#consultar-paciente)
   3. [Atualizar Paciente](#atualizar-paciente)
3. [Encaminhamentos](#encaminhamentos)
   1. [Criar Encaminhamento](#criar-encaminhamento)
   2. [Consultar Encaminhamento](#consultar-encaminhamento)
   3. [Atualizar Encaminhamento](#atualizar-encaminhamento)

## 1. Configuração do Servidor <a name="configuracao-do-servidor"></a>

A API "Prontuário-UFPel" utiliza o framework Express.js e é executada em uma porta específica (padrão 3333). Além disso, as configurações de CORS são aplicadas para permitir a comunicação com diferentes origens.

Exemplo de inicialização do servidor:

```javascript
const http = require("http");
const express = require("express");
const crypto = require("crypto");
const db = require('./database/db');

const app = express();
const port = process.env.PORT || 3333;
app.set('port', port);

// Configurações de CORS
app.use(function (req, res, next) {
  // Configurações de CORS aqui
  next();
});

const server = http.createServer(app);

// Inicialização do servidor
server.listen(port, () => {
  console.log("API escutando na porta: " + port);
});
```

## 2. Pacientes <a name="pacientes"></a>

### 2.1. Criar Paciente <a name="criar-paciente"></a>

Endpoint para criar um novo registro de paciente.

- **URL:** `/pacientes/criar`
- **Método:** POST
- **Corpo da Requisição:**
  ```json
  {
    "CPF": "123.456.789-00",
    "Nome": "João da Silva",
    "DataNasc": "1985-01-15",
    // Campos adicionais do paciente...
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "pacienteCriado": true,
    "message": "Paciente criado com sucesso"
  }
  ```
- **Resposta de Erro:**
  ```json
  {
    "pacienteCriado": false,
    "message": "Paciente com esse CPF já existe"
  }
  ```

### 2.2. Consultar Paciente <a name="consultar-paciente"></a>

Endpoint para consultar informações de pacientes com base no CPF ou nome.

- **URL:** `/pacientes/consultar`
- **Método:** POST
- **Corpo da Requisição:**
  - Consulta por CPF:
    ```json
    {
      "CPF": "123.456.789-00"
    }
    ```
  - Consulta por Nome (com correspondência parcial):
    ```json
    {
      "Nome": "Silva"
    }
    ```
- **Resposta de Sucesso:**
  ```json
  [
    {
      "CPF": "123.456.789-00",
      "Nome": "João da Silva",
      "DataNasc": "1985-01-15",
      // Campos adicionais do paciente...
    },
    // Outros registros, se houver
  ]
  ```
- **Resposta de Erro:**
  ```json
  {
    "error": "Paciente não encontrado."
  }
  ```

### 2.3. Atualizar Paciente <a name="atualizar-paciente"></a>

Endpoint para atualizar informações de um paciente existente.

- **URL:** `/pacientes/atualizar`
- **Método:** POST
- **Corpo da Requisição:**
  ```json
  {
    "CPF": "123.456.789-00",
    // Campos a serem atualizados...
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "message": "Informações do paciente atualizadas com sucesso."
  }
  ```
- **Resposta de Erro:**
  ```json
  {
    "error": "Nenhum campo para atualizar."
  }
  ```

## 3. Encaminhamentos <a name="encaminhamentos"></a>

### 3.1. Criar Encaminhamento <a name="criar-encaminhamento"></a>

Endpoint para criar um novo encaminhamento médico.

- **URL:** `/encaminhamentos/criar`
- **Método:** POST
- **Corpo da Requisição:**
  ```json
  {
    "CPF": "123.456.789-00",
    "Data": "2023-08-09",
    "Especialidade": "Pediatria",
    "Demanda": "Avaliação clínica",
    "Status": "Pendente"
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "message": "Encaminhamento criado com sucesso"
  }
  ```
- **Resposta de Erro:**
  ```json
  {
    "message": "Erro ao criar o encaminhamento."
  }
  ```

### 3.2. Consultar Encaminhamento <a name="consultar-encaminhamento"></a>

Endpoint para consultar encaminhamentos com base no CPF do paciente e/ou especialidade.

- **URL:** `/encaminhamentos/consultar`
- **Método:** POST
- **Corpo da Requisição:**
  ```json
  {
    "CPF": "123.456.789-00",
    "Especialidade": "Pediatria"
  }
  ```
- **Resposta de Sucesso:**
  ```json
  [
    {
      "id": 1,
      "CPF": "123.456.789-00",
      "Especialidade": "Pediatria",
      "Data": "2023-08-09",
      // Outros campos do encaminhamento...
    },
    // Outros registros, se houver
  ]
  ```
- **Resposta de Erro:**
  ```json
  {
    "error": "Nenhum encaminhamento encontrado."
  }
  ```

### 3.3. Atualizar Encaminhamento <a name="atualizar-encaminhamento"></a>

Endpoint para atualizar informações de um encaminhamento méd

ico existente.

- **URL:** `/encaminhamentos/atualizar`
- **Método:** POST
- **Corpo da Requisição:**
  ```json
  {
    "id": 1,

    "Demanda": "Avaliação clínica, foi indentificado 76 e 86 com icdas 5 na oclusal",
    "Status": "Alta"
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "message": "Encaminhamento atualizado com sucesso."
  }
  ```
- **Resposta de Erro:**
  ```json
  {
    "error": "Nenhum campo para atualizar."
  }
  ```

## Observações Finais

Esta documentação abrange os principais endpoints e funcionalidades da API "Prontuário-UFPel". Certifique-se de utilizar os métodos e parâmetros corretos ao fazer as requisições. Em caso de dúvidas ou problemas, consulte o desenvolvedor responsável pelo sistema.