exports.up = function(knex) {
    return knex.schema.createTable('pacientes', function (table) {
        table.increments('id').primary();
        table.string('CPF').notNullable();
        table.string('CNS');
        table.string('Nome');
        table.string('Rg');
        table.string('DataNasc');
        table.string('Email');
        table.string('Tel');
        table.string('EstadoCivil');
        table.string('Sexo');
        table.string('NomeMae');
        table.string('NomePai');
        table.string('CorRaca');
        table.string('PNE');
        table.string('EnderecoTipo');
        table.string('Cep');
        table.string('Rua');
        table.string('EndNumero');
        table.string('EndComplemento');
        table.string('Bairro');
        table.string('Cidade');
    }).createTable('encaminhamentos', function (table) {
        table.increments('id').primary();
        table.string('CPF').references('CPF').inTable('pacientes').notNullable().onDelete('CASCADE');
        table.string('Data').notNullable();
        table.string('Curso');
        table.string('Especialidade');
        table.string('Demanda');
        table.string('Status');
        table.string('Observacoes');
        table.string('Complexidade');
        
    }).createTable('usuarios', function (table) {
        table.increments('id').primary();
        table.string('Matricula').notNullable();
        table.string('Nome').notNullable();
        table.string('Tipo').notNullable();
        table.string('Pacientes')
    })
};


exports.down = function(knex) {
    return knex.schema
    .dropTable("pacientes")
    .dropTable("encaminhamentos")
    .dropTable("usuarios");};
