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

app.get('/teste-retornar/:CPF',async (req, res) => { 
  
  return res.json( await db('pacientes').where('CPF', req.params.CPF).select('*')); 
 
 });
 
 app.post('/consulta-cpf/',async (req, res) => {
   const { CPF } = req.body;
   console.log(CPF)

 return res.json( await db('pacientes').where('CPF', CPF).select('*')); 

 });

 app.post('/consulta-nome/',async (req, res) => {
   
  const { Nome } = req.body;

  return res.json(await db('pacientes').where('Nome', 'LIKE', `%${Nome}%`).select('*'))
});

app.post('/Criar_paciente', async (req, res) => {
  console.log(req.body);
  const {
    Cpf,
    Nome,
    Rg,
    DataNasc,
    Email,
    Tel,
    EstadoCivil,
    Sexo,
    NomeMae,
    NomePai,
    CorRaca,
    PNE,
    EnderecoTipo,
    Cep,
    Rua,
    EndNumero,
    EndComplemento,
    Bairro,
    Cidade
  } = req.body;

  var verifica = await db('pacientes').where('CPF', Cpf).select('*')
console.log(verifica)
  if (verifica.length > 0) {
    return res.json({ 'pacienteCriado': false, "message":"Paciente com esse cpf já existe" });
  }
 
  await db('pacientes').insert({
    Cpf,
    Nome,
    Rg,
    DataNasc,
    Email,
    Tel,
    EstadoCivil,
    Sexo,
    NomeMae,
    NomePai,
    CorRaca,
    PNE,
    EnderecoTipo,
    Cep,
    Rua,
    EndNumero,
    EndComplemento,
    Bairro,
    Cidade
  });

  return res.json({ 'pacienteCriado': true, "message": "Paciente criado com sucesso" });
});



console.log("api escutando em http://localhost:"+port)
server.listen(port);

