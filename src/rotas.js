const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const produtos = require('./controladores/produtos');
const verificaLogin = require('./filtros/verificaLogin');

const rotas = express();

rotas.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // Retorna uma resposta vazia com status 204 (No Content)
});

// Login não precisa de verificação de login
rotas.post('/login', login.login);

// Cadastro de usuário
rotas.post('/usuarios', usuarios.cadastrarUsuario);

// Middleware de verificação de login para rotas abaixo
rotas.use(verificaLogin);

// Obter e atualizar perfil do usuário logado
rotas.get('/perfil', usuarios.obterPerfil);
rotas.put('/perfil', usuarios.atualizarPerfil);

// CRUD de produtos
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.obterProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;