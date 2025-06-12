import express  from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())

const autor = []

app.post('/usuarios', async (req, res) => {


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

app.get('/usuarios', async (req, res) => {

    let autor = []

    if(req.query){
        autor = await prisma.autor.findMany({
            where: {
                nome:          req.query.nome,
                biografia:     req.query.biografia,
                data_nascimento: req.query.data_nascimento ? new Date(req.query.data_nascimento) : undefined,
                nacionalidade: req.query.nacionalidade,
            }
        })

    }else {
        const autor = await prisma.autor.findMany()
    }
    
    
    
    
    
    res.status(200).json(autor)



})

app.put('/usuarios/:id', async (req, res) => {


    await prisma.autor.update({
        where: {
            id: req.params.id
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

app.delete('/usuarios/:id', async (req, res) => {
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
  try {
    const novoLivro = await prisma.livro.create({
      data: {
        titulo: req.body.titulo,
        genero: req.body.genero,
        ano_publicacao: req.body.ano_publicacao,
        num_paginas: req.body.num_paginas,
        id_autor: req.body.autorId,  // <- esse campo é o nome da FK real no Prisma
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
    autor: true,  // <-- corrigido para 'Autor' com A maiúsculo
  },
    });
    res.status(200).json(livros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar livros.' });
  }
});

// Atualizar livro
app.post('/livros', async (req, res) => {
  try {
    const novoLivro = await prisma.livro.create({
      data: {
        titulo: req.body.titulo,
        genero: req.body.genero,
        ano_publicacao: req.body.ano_publicacao,
        numero_paginas: req.body.num_paginas,  // CORRIGIDO AQUI
        id_autor: req.body.autorId,
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

/*
banco: ibiel
        admin
*/
