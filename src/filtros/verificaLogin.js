const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json('Não autorizado!');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();
        const { id } = jwt.verify(token, senhaHash); // Verifica o token usando o segredo 'senhaDaApiMarketPlace'

        const usuarioEncontrado = await knex('usuarios').where({ id }).first();

        if (!usuarioEncontrado) {
            return res.status(404).json('Usuário não encontrado');
        }

        req.usuario = usuarioEncontrado; // Define req.usuario com os dados do usuário autenticado
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json('Token inválido');
    }
};

module.exports = verificaLogin;