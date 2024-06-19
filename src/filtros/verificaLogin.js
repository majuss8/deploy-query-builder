const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, senhaHash);

        // const query = 'select * from usuarios where id = $1';
        // const { rows, rowCount } = await conexao.query(query, [id]);

        const usuarioEncontrado = await knex('usuarios').where({ id }).first();

        if (!usuarioEncontrado) {
            return res.status(404).json('Usuario não encontrado');
        }

        const { senha, ...usuario } = usuarioEncontrado;

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

module.exports = verificaLogin