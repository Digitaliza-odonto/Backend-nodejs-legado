const http = require("http");
const express = require("express");
const crypto = require("crypto");
const db = require('./database/db');

const app = express();
const port = process.env.PORT || 3333;
app.set('port', port);

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions) 
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


const server = http.createServer(app);

app.get('/',async (req, res) => {
  
 const name  = "Prontuário-UFPel";
 const version = "1.0.0";
 const build = "success"
  return res.json( { name, version, build } ); 
 
 });

app.use(express.json());

 
//Pacientes ----------------------------------------------------------------------------------------------------------------------
app.post('/pacientes/criar', async (req, res) => {
  console.log("criar paciente");
  console.log(req.body);
  try {
    const { CPF, Nome, Rg, DataNasc, Email, Tel, EstadoCivil, Sexo, NomeMae, NomePai, CorRaca, PNE, EnderecoTipo, Cep, Rua, EndNumero, EndComplemento, Bairro, Cidade } = req.body;

    const existingPatient = await db('pacientes').where('CPF', CPF).select('*');

    if (existingPatient.length > 0) {
      return res.json({ pacienteCriado: false, message: 'Paciente com esse CPF já existe' });
    }

    await db('pacientes').insert({
      CPF, Nome, Rg, DataNasc, Email, Tel, EstadoCivil, Sexo, NomeMae, NomePai, CorRaca, PNE, EnderecoTipo, Cep, Rua, EndNumero, EndComplemento, Bairro, Cidade
    });

    return res.json({ pacienteCriado: true, message: 'Paciente criado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar paciente.' });
  }
});


app.post('/pacientes/consultar', async (req, res) => {
  const { CPF, Nome } = req.body;

  if (CPF) {
    try {
      const result = await db('pacientes').where('cpf', CPF).select('*');
      if (result.length === 0) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao consultar paciente.' });
    }
  } else if (Nome) {
    try {
      const result = await db('pacientes').where('Nome', 'LIKE', `%${Nome}%`).select('*');
      if (result.length === 0) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao consultar paciente.' });
    }
  } else {
    return res.status(400).json({ error: 'Informe CPF ou Nome para consulta.' });
  }
});

app.post('/pacientes/consultar/aluno', async (req, res) => {
  console.log("consultar pacientes do aluno");
  console.log(req.body);
  // recebe a matricula do aluno e retorna os pacientes que ele atende
  const { Matricula } = req.body;
  // onsulta na tabela de usuarios o campo pacientes
  try {
    const result = await db('usuarios').where('Matricula', Matricula).select('*');
    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    console.log(result);
    const pacientes = JSON.parse(result[0].Pacientes);
    console.log(pacientes);
    for (let i = 0; i < pacientes.length; i++) {
      let CPF = pacientes[i];
      const pacienteResult = await db('pacientes').where('CPF', CPF).select('*');
      pacientes[i] = pacienteResult[0];
    }
    console.log(pacientes);
    return res.json(pacientes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao consultar pacientes.' });
  }
});

app.post('/pacientes/atualizar', async (req, res) => {
  console.log(req.body);
  const { CPF, Nome, DataNasc, Email, Tel, EstadoCivil, Sexo, NomeMae, NomePai, CorRaca, PNE, EnderecoTipo, Cep, Rua, EndNumero, EndComplemento, Bairro, Cidade } = req.body;

  // Create an object with only the fields that have values
  const updateFields = {};
  if (Nome !== undefined) updateFields.Nome = Nome;
  if (DataNasc !== undefined) updateFields.DataNasc = DataNasc;
  if (Email !== undefined) updateFields.Email = Email;
  if (Tel !== undefined) updateFields.Tel = Tel;
  if (EstadoCivil !== undefined) updateFields.EstadoCivil = EstadoCivil;
  if (Sexo !== undefined) updateFields.Sexo = Sexo;
  if (NomeMae !== undefined) updateFields.NomeMae = NomeMae;
  if (NomePai !== undefined) updateFields.NomePai = NomePai;
  if (CorRaca !== undefined) updateFields.CorRaca = CorRaca;
  if (PNE !== undefined) updateFields.PNE = PNE;
  if (EnderecoTipo !== undefined) updateFields.EnderecoTipo = EnderecoTipo;
  if (Cep !== undefined) updateFields.Cep = Cep;
  if (Rua !== undefined) updateFields.Rua = Rua;
  if (EndNumero !== undefined) updateFields.EndNumero = EndNumero;
  if (EndComplemento !== undefined) updateFields.EndComplemento = EndComplemento;
  if (Bairro !== undefined) updateFields.Bairro = Bairro;
  if (Cidade !== undefined) updateFields.Cidade = Cidade;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
  }

  try {
    // Perform the update query
    const updatedRows = await db('pacientes')
      .where('CPF', CPF)
      .update(updateFields);

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }

    return res.json({ message: 'Informações do paciente atualizadas com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar as informações do paciente.', error: error });
  }
});

// Encaminhamentos --------------------------------------------------------------------------------------------------------------
app.post('/encaminhamentos/consultar', async (req, res) => {
  try {
    const { CPF, Especialidade } = req.body;

    let query = db('encaminhamentos').select('*');

    
      query = query.where('CPF', CPF);
    

    if (Especialidade) {
      query = query.andWhere('Especialidade', Especialidade);
    }

    const result = await query;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Nenhum encaminhamento encontrado.' });
    }

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao consultar encaminhamentos.' });
  }
});


app.post('/encaminhamentos/criar',async (req, res) => {
  console.log("criar encaminhamento");
  console.log(req.body);
   
  console.log(req.body);
  const { CPF, Data, Especialidade, Demanda, Status, Curso, Complexidade } = req.body;

  try {
    await db('encaminhamentos').insert({
      CPF, Data, Especialidade, Demanda, Status, Curso, Complexidade
    });

    return res.json({ message: "Encaminhamento criado com sucesso" });

  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar o encaminhamento.', error: error });
  }


});

app.post('/encaminhamentos/atualizar', async (req, res) => {
  console.log(req.body);
  const { id, Data, Especialidade, Demanda, Status } = req.body;

  // Create an object with only the fields that have values
  const updateFields = {};
  if (Data !== undefined) updateFields.Data = Data;
  if (Especialidade !== undefined) updateFields.Especialidade = Especialidade;
  if (Demanda !== undefined) updateFields.Demanda = Demanda;
  if (Status !== undefined) updateFields.Status = Status;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
  }

  try {
    // Perform the update query
    const updatedRows = await db('encaminhamentos')
      .where('id', id)
      .update(updateFields);

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Encaminhamento não encontrado.' });
    }

    return res.json({ message: 'Encaminhamento atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar o encaminhamento.', error:error });
  }
});


// Usuários ----------------------------------------------------------------------------------------------------------------------
app.post('/usuarios/login', async (req, res) => {
  const { CPF } = req.body;

  try {
    const result = await db('usuarios').where('CPF', CPF).select('*');
    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao consultar usuário.' });
  }
});

app.post('/usuarios/criar', async (req, res) => {
  console.log("criar usuario");
  console.log(req.body);
  try {
    const { Matricula, Nome, Tipo, Pacientes } = req.body;

    const existingUser = await db('usuarios').where('Matricula', Matricula).select('*');

    if (existingUser.length > 0) {
      return res.json({ usuarioCriado: false, message: 'Usuário com essa Matricula já existe' });
    }

    await db('usuarios').insert({
      Matricula, Nome, Tipo, Pacientes
    });

    return res.json({ usuarioCriado: true, message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar usuário.' });
  }
});


console.log("api escutando em http://localhost:"+port)
server.listen(port);

