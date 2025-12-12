import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('welcome to EmmaSunny home')
});
let port = process.env.PORT
app.listen(port, ()=>{
    console.log(`app is running on port ${port}`);
})