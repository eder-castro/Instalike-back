import { getTodosPosts, criarPost, atualizarPost, deletarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts (req, res) {
    // Obtém todos os posts
    const posts = await getTodosPosts();
    // Envia uma resposta HTTP com código 200 (sucesso) e os posts em JSON
    res.status(200).json(posts);
}

export async function postarNovoPost (req, res) {
    const novoPost = req.body;
    try{
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function uploadImagem (req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };
    
    try{
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function atualizarNovoPost (req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    
    try{
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imageBuffer)
        const post = {
            imgUrl:urlImagem,
            descricao:descricao,
            alt:req.body.alt
        }
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

// Adicione esta nova função no postsController.js
export async function deletarNovoPost(req, res) {
    const id = req.params.id;
    try {
        const resultado = await deletarPost(id);
        if (resultado.deletedCount === 0) {
            res.status(404).json({"Erro": "Post não encontrado"});
            return;
        }
        // Se houver uma imagem associada, também a deletamos
        try {
            fs.unlinkSync(`uploads/${id}.png`);
        } catch (erro) {
            console.log("Imagem não encontrada ou já deletada");
        }
        res.status(200).json({"mensagem": "Post deletado com sucesso"});
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}