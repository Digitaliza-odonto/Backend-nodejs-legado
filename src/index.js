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
  try {
    const { Cpf, Nome, Rg, DataNasc, Email, Tel, EstadoCivil, Sexo, NomeMae, NomePai, CorRaca, PNE, EnderecoTipo, Cep, Rua, EndNumero, EndComplemento, Bairro, Cidade } = req.body;

    const existingPatient = await db('pacientes').where('CPF', Cpf).select('*');

    if (existingPatient.length > 0) {
      return res.json({ pacienteCriado: false, message: 'Paciente com esse CPF já existe' });
    }

    await db('pacientes').insert({
      Cpf, Nome, Rg, DataNasc, Email, Tel, EstadoCivil, Sexo, NomeMae, NomePai, CorRaca, PNE, EnderecoTipo, Cep, Rua, EndNumero, EndComplemento, Bairro, Cidade
    });

    return res.json({ pacienteCriado: true, message: 'Paciente criado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar paciente.' });
  }
});


app.post('/pacientes/consulta', async (req, res) => {
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


// Encaminhamentos --------------------------------------------------------------------------------------------------------------

app.post('encaminhamentos/criar/',async (req, res) => {
   
  console.log(req.body);
  const { CPF, Data, Especialidade, Demanda, Status } = req.body;

  await db('encaminhamentos').insert({
    CPF, Data, Especialidade, Demanda, Status
  });

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
      return res.status(404).json({ error: 'Encaminhamento não encontrado.' });
    }

    return res.json({ message: 'Encaminhamento atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar o encaminhamento.' });
  }
});


console.log("api escutando em http://localhost:"+port)
server.listen(port);

