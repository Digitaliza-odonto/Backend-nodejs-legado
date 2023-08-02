exports.up = function(knex) {
    return knex.schema.createTable('pacientes', function (table) {
        table.increments('id').primary();
        table.string('CPF').notNullable();
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
    });
};


exports.down = function(knex) {
    return knex.schema
    .dropTable("pacientes");};
