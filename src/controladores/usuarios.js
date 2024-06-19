const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    if (!nome_loja) {
        return res.status(404).json("O campo nome_loja é obrigatório");
    }

    try {
        // const { rowCount: quantidadeUsuarios } = await conexao.query('select * from usuarios where email = $1', [email]);
        const emailExiste = await knex('usuarios').where({email}).first();

        if (emailExiste) {
            return res.status(400).json("O email já existe");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // const query = 'insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';
        // const usuario = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja]);
        const usuario = await knex('usuarios').insert({
            nome,
            email,
            senha: senhaCriptografada,
            nome_loja
        }).returning('*'); 

        if (!usuario[0]) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json(usuario[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    // Valida se pelo menos um campo foi informado para atualização
    if (!nome && !email && !senha && !nome_loja) {
        return res.status(400).json('É obrigatório informar ao menos um campo para atualização');
    }

    try {
        // Verifica se o novo email já está em uso por outro usuário
        if (email && email !== req.usuario.email) {
            const emailExiste = await knex('usuarios').where({ email }).first();

            if (emailExiste) {
                return res.status(400).json("O email já está em uso");
            }
        }

        // Criptografa a nova senha, se informada
        let senhaCriptografada;
        if (senha) {
            senhaCriptografada = await bcrypt.hash(senha, 10);
        }

        // Atualiza os dados do usuário no banco de dados
        const usuarioAtualizado = await knex('usuarios').where({ id: req.usuario.id }).update({
            nome,
            email,
            senha: senhaCriptografada,
            nome_loja
        });

        // Verifica se o usuário foi atualizado com sucesso
        if (!usuarioAtualizado) {
            return res.status(400).json("O usuário não foi atualizado");
        }

        return res.status(200).json('Usuário atualizado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}