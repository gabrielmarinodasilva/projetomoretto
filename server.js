import express  from 'express'
import cors from 'cors'
import { PrismaClient } from './generated/prisma/index.js'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())

const users = []

app.post('/usuarios', async (req, res) => {


    await prisma.user.create({
        data: {
            nome:          req.body.nome,
            biografia:     req.body.biografia,
            idade:         req.body.idade,
            nacionalidade: req.body.nacionalidade
        }
    })

    res.status(201).json(req.body)

}) 

app.get('/usuarios', async (req, res) => {

    let users = []

    if(req.query){
        users = await prisma.user.findMany({
            where: {
                nome:          req.query.nome,
                biografia:     req.query.biografia,
                idade:         req.query.idade,
                nacionalidade: req.query.nacionalidade
            }
        })

    }else {
        const users = await prisma.user.findMany()
    }
    
    
    
    
    
    res.status(200).json(users)



})

app.put('/usuarios/:id', async (req, res) => {


    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            nome:          req.body.nome,
            biografia:     req.body.biografia,
            idade:         req.body.idade,
            nacionalidade: req.body.nacionalidade
        }
    })

    res.status(201).json(req.body)

})

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({message: 'usuarios deletado'})
})

app.listen(3000)

/*
banco: ibiel
        admin
*/
