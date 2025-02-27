import express from "express"

const app = express()

app.get('/', (req, res) => {
  res.send("Backend Orquesta")
})


const PORT = 3000

app.listen((PORT), () => {
    console.log(`server started on port ${PORT}`)
    });