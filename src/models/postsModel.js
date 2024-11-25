import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados MongoDB usando a string de conexão do ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO)

// Função assíncrona para obter todos os posts do banco de dados
export async function getTodosPosts() {
    // Seleciona o banco de dados "imersao-instabytes" 
    const db = conexao.db("imersao-instabytes")
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts")
    // Busca todos os documentos (posts) na coleção e retorna como um array
    return colecao.find().toArray()
}

export async function criarPost(novoPost) {
    // Seleciona o banco de dados "imersao-instabytes" 
    const db = conexao.db("imersao-instabytes")
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts")
    // Busca todos os documentos (posts) na coleção e retorna como um array
    return colecao.insertOne(novoPost)
}

export async function atualizarPost(id, novoPost) {
    // Seleciona o banco de dados "imersao-instabytes" 
    const db = conexao.db("imersao-instabytes")
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts")
    // Busca todos os documentos (posts) na coleção e retorna como um array
    const objId = ObjectId.createFromHexString(id)
    return colecao.updateOne({_id: new ObjectId(objId)},{$set: novoPost})
}

// Função para deletar um post por ID
export async function deletarPost(id) {
    const db = conexao.db("imersao-instabytes")
    const colecao = db.collection("posts")
    const objId = ObjectId.createFromHexString(id)
    return colecao.deleteOne({_id: new ObjectId(objId)})
}
