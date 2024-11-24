import cors from "cors";
import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({dest: "./uploads", storage})

//Rota para buscar todos os posts
const routes = (app) => {
    // Habilita o parsing de JSON no corpo das requisições
    app.use(express.json());
    app.use(cors(corsOptions));
    // Define uma rota GET para obter todos os posts
    app.get("/posts", listarPosts);
    // Define uma rota POST para criar um post
    app.post("/posts", postarNovoPost);
    //Define uma rota POST para upload de imagens
    app.post("/upload", upload.single("imagem"), uploadImagem);
    //Define uma rota PUT para atualizar um post
    app.put("/upload/:id", atualizarNovoPost)
}

export default routes;