import express from 'express'
import mongoose from 'mongoose'
import { DATABASE_URL, PORT } from './constants.js'
import Task from './task.js'
import cors from 'cors';

const app = express(); 
app.use(cors())

app.use(express.json());

await mongoose.connect(DATABASE_URL);

app.post("/tasks", async (req, res) => {
  const newTask = await Task.create(req.body)
  res.status(201).send(newTask)
})

app.get("/tasks", async (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;
  
  if (count === 0 ) {
    return res.json([])
  }
  
  const sortOption = 
    sort === "oldest" ? ['createdAt', 'asc'] : ['createdAt', 'desc']

  const tasks = await Task.find().limit(count).sort([sortOption])
  res.send(tasks)
})


app.get("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (task) {
    res.send(task)
  } else {
    res.status(404).send({message: "Cannot find given id"})
  }
})


app.patch("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id)
if (task) {
  const { body } = req
  Object.keys(body).forEach((key) => {
    task[key] = body[key]
  })
  await task.save()
  res.send(task);
} else {
  res.status(404).send({message: "Cannot find given id"})
}
})


app.delete("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id)
  if (task) { 
    res.sendStatus(200)
  } else {
    res.status(404).send({message: "Cannot find given id"})
  }
})

app.listen(PORT, () => {
  console.log("Server Started")
})


