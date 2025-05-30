const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()




app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.use('/uploads', express.static('uploads')); // pour servir les fichiers PDF

app.use(cors({
    origin: 'http://localhost:5173', // ou l'URL de ton frontend
    credentials: true                //  Permet d'accepter les cookies
  }));
app.use(cookieParser())


const auth = require('./routes/Routes')
app.use('/api', auth)


const port = process.env.port
app.listen(port, ()=>{
    console.log(`the server is running at the port ${port}...`)
})