// Constantes
const express = require('express')
const { use } = require('express/lib/application')
const req = require('express/lib/request')
const res = require('express/lib/response')
const app = express()
const port = 3000

// Express
app.use(express.json())

// Variables
let users = [{id:0, firstname:"Solal", name:"BOMPAIS", password:"SupraMK4"},{id:1, firstname:"Jérémy", name:"Courby", password:"Bloblob"}]
let auto_increment = 0

// GET
app.get('/', (req, res) => 
{
    res.send('Hello World!')
})

app.get('/users', function(req, res) 
{
    res.send(users)
})

app.get('/users/:firstname', function(req,res)
{
    if(req.params.firstname)
    {
        res.status(200).send(users.filter(user => {return req.params.firstname === user.firstname}))
    } 
    else
    {
        res.send(users)
        res.status(400)
    }
})

// POST
app.post('/users', function(req,res) 
{
    let newUser = req.body
    newUser.id = auto_increment
    users.push(newUser)
    auto_increment++
    res.sendStatus(201)
})

// PUT
app.put('/users/:id', function(req,res)
{
    const { id } = req.params 
    const { firstname, name, password} = req.body;
    const foundUser = users.find((u) => u.id === parseInt(id))
    if(foundUser === undefined)
    {
        res.status(400).json({message : "Utilisateur inexistant"})
    }
    else
    {
        foundUser.firstname = firstname || foundUser.firstname
        foundUser.name = name || foundUser.name
        foundUser.password = password || foundUser.password
        res.json({message : "utilisateur MAJ"})
        res.status(200)
    }
})

// SUPPR
app.delete('/users/:id', function(req,res){
    const { id } = req.params
    const foundUser = users.find((u) => u.id === parseInt(id))
    if(foundUser === undefined)
    {
        res.status(400).json({message : "Utilisateur inexistant"})
    }
    else
    {
        users.splice(foundUser, 1)
        res.json({message: "utilisateur supprimé"})
        res.status(200)
    }
})

// LISTEN
app.listen(port, () => 
{
    console.log(`Example app listening on port ${port}`)
})