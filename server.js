import express  from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())

const autor = []

app.post('/autor', async (req, res) => {


    await prisma.autor.create({
        data: {
            nome:          req.body.nome,
            biografia:     req.body.biografia,
            data_nascimento: req.body.data_nascimento ? new Date(req.body.data_nascimento) : null,
            nacionalidade: req.body.nacionalidade,
        }
    })

    res.status(201).json(req.body)

}) 

app.get('/autor', async (req, res) => {

    let autor = []

    if(req.query){
       autor = await prisma.autor.findMany({
              where: {
                nome: req.query.nome,
                biografia: req.query.biografia,
                data_nascimento: req.query.data_nascimento ? new Date(req.query.data_nascimento) : undefined,
                nacionalidade: req.query.nacionalidade,
              },
              include: {
                livros: true,  // trazer os livros do autor
              },
            })

    }else {
        const autor = await prisma.autor.findMany()
    }
    
    
    
    
    res.status(200).json(autor)



})

app.put('/autor/:id', async (req, res) => {


    await prisma.autor.update({
        where: {
            id_autor: parseInt(req.params.id)
        },
        data: {
            nome:          req.body.nome,
            biografia:     req.body.biografia,
            data_nascimento: req.body.data_nascimento ? new Date(req.body.data_nascimento) : null,
            nacionalidade: req.body.nacionalidade,
        }
    })

    res.status(201).json(req.body)

})

app.delete('/autor/:id', async (req, res) => {
    await prisma.autor.delete({
        where: {
            id_autor: parseInt(req.params.id),
        }
    })
    res.status(200).json({message: 'usuarios deletado'})
})
//===================================================================================================================
// Criar um livro
app.post('/livros', async (req, res) => {
  console.log('Body recebido:', req.body);
  try {
    const novoLivro = await prisma.livro.create({
      data: {
        titulo: req.body.titulo,
        genero: req.body.genero,
        ano_publicacao: req.body.ano_publicacao,
        numero_paginas : req.body.numero_paginas,
        id_autor: req.body.id_autor,
      },
    });
    res.status(201).json(novoLivro);
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({ erro: 'Erro ao criar livro.', detalhe: error.message });
  }
});

// Listar livros com dados do autor
app.get('/livros', async (req, res) => {
  try {
    const livros = await prisma.livro.findMany({
      include: {
        Autor: true,  // traz dados do autor junto
      },
    });
    res.status(200).json(livros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar livros.' });
  }
});

// Atualizar livro
app.put('/livros/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const livroAtualizado = await prisma.livro.update({
      where: { id_livro: id },
      data: {
        titulo: req.body.titulo,
        genero: req.body.genero,
        ano_publicacao: req.body.ano_publicacao,
        numero_paginas : req.body.numero_paginas,
        id_autor: req.body.id_autor,
      },
    });

    res.status(200).json(livroAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar livro.' });
  }
});

// Deletar livro
app.delete('/livros/:id', async (req, res) => {
  try {
    await prisma.livro.delete({
      where: { id_livro: parseInt(req.params.id) },
    });
    res.status(200).json({ message: 'Livro deletado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar livro.' });
  }
});



app.listen(3000)
