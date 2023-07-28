exports.up = function(knex) {
    return knex.schema.createTable('pacientes', function (table) {
        table.increments('id').primary();
        table.string('CPF').notNullable();
        table.string('Nome').notNullable();
        table.string('Tipo_documento').notNullable().defaultTo('Cédula de Identidade');
        table.string('RG').notNullable();
        table.string('Orgao_expedidor').notNullable();
        table.date('Dt_emissao').notNullable();
        table.date('Dt_nascimento').notNullable();
        table.string('email').notNullable();
        table.string('Nacionalidade').notNullable();
        table.string('Naturalidade').notNullable();
        table.string('Estado_civil').notNullable().defaultTo('SOLTEIRO');
        table.string('Sexo').notNullable().defaultTo('Outro');
        table.string('Nome_mae').notNullable();
        table.string('Nome_pai').notNullable();
        table.string('Cor_raca').notNullable().defaultTo('Não quis declarar');
        table.boolean('Paciente_com_necessidade_especial').defaultTo(false);
        table.string('Condicao_especial').nullable();
        table.string('Endereco_tipo').notNullable().defaultTo('Família');
        table.string('CEP').notNullable();
        table.string('Endereco').notNullable();
        table.string('Numero').notNullable();
        table.string('Complemento').nullable();
        table.string('Bairro').notNullable();
        table.string('Cidade').notNullable();
    });
};


exports.down = function(knex) {
    return knex.schema
    .dropTable("pacientes");};
