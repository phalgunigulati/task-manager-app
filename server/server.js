const express = require('express')
const {v4: uuidv4} = require('uuid')
const cors = require('cors')
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path');

const app = express()

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true // replace with your actual production domain
    : 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions))
app.use(express.json());  

// get all tasks
app.get('/tasks/:userEmail',  async (req, res) => {
  const { userEmail } = req.params;
  console.log(userEmail); 

    try{
      const tasks = await pool.query('SELECT * FROM tasks WHERE user_email = $1', [userEmail] )
      res.json(tasks.rows)
    } catch(err){
        console.error(error);
    }
})

// create a new task

app.post('/tasks', async (req, res) => {
  const{ user_email, title, progress, date} = req.body
  console.log(user_email, title, progress, date)
  const id = uuidv4()
 
  try{
    const newTask = await pool.query(`INSERT INTO tasks(id, user_email, title, progress, date) VALUES($1, $2, $3, $4 ,$5)`, 
      [id, user_email,  title, progress, date])
      res.json(newTask)
      // window.location.reload(); 
  }catch(err){
    console.error(err); 
  }
})

// edit a task
app.put('/tasks/:id', async (req, res) => {
  const {id} = req.params
  const{ user_email, title, progress, date} = req.body
  // console.log(user_email, title, progress, date)
  try{
    const editTask = await pool.query('UPDATE tasks SET user_email = $1, title = $2, progress = $3, date = $4 WHERE ID = $5;', [user_email,  title, progress, date, id])
      res.json(editTask)
  }catch(err){
    console.error(err); 
  }
})
 
// edit a task
app.delete('/tasks/:id', async (req, res) => {
  const {id} = req.params
  try{
  const deleteTask = await pool.query('DELETE FROM tasks WHERE ID = $1;', [id])
  res.json(deleteTask)
  }catch(err){
    console.error(err); 
  }
})

// signup
app.post('/signup', async (req, res) => {
  const {email, password} = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  try{
    const signup = await pool.query(`INSERT INTO users (email, hashed_password) VALUES ($1, $2)`, 
      [email, hashedPassword])

      const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

      res.json({email, token})

  } catch (err) {
    console.error(err)
    if(err){
      res.json({detail: err.detail})
    }
  }
})

// login

app.post('/login', async (req, res) => {
  const {email, password} = req.body
  try{

    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    
    if(!users.rows.length) return res.json({detail: 'User does not exist'})
    const success = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
    if(success){
      res.json({ 'email' : users.rows[0].email, token})
    } else {
      res.json({detail: "login failed"})
    }
  } catch (err) {
    console.error(err)
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8000; 

app.listen(PORT, () =>console.log(`SERVER RUNNING ON PORT ${PORT}`)) 