const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
const saltRound = 8

dotenv.config();
const secret = process.env.SECRET

mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.error(err));

// schema
const userSchema = new mongoose.Schema({
   name: { type: String },
   email: { type: String },
   password: { type: String },
})
// model
const userModel = mongoose.model('users', userSchema)

app.use(cors());

app.use(express.json());

// jwt
const createToken = (payload) => jwt.sign(payload, secret, { expiresIn: '1d' })
const decodeToken = (token) => jwt.verify(token, secret)


app.post('/register', async (req, res) => {
   try {
      const body = req.body
      const hash = bcrypt.hashSync(body.password, saltRound)
      const user = { name: body.name, email: body.email, password: hash }
      const newUser = await userModel.create(user)
      console.log(newUser);
      res.json({ success: true })
   } catch (error) {
      console.log(error);
      res.status(error.code || 500).json({ msg: error.msg || 'something went wrong' })
   }
});

app.all('/test', async (req, res) => {
   res.json({ success: true })
});


app.post('/login', async (req, res) => {
   try {
      const body = req.body
      const userFromDb = await userModel.findOne({ email: body.email })
      console.log({ userFromDb });
      if (!userFromDb) throw ({ msg: 'אין יוזר כזה', code: 404 })
      const isRight = bcrypt.compareSync(body.password, userFromDb.password)
      console.log({ isRight });
      if (!isRight) throw ({ msg: 'not auth', code: 403 })
      const token = createToken({ _id: userFromDb._id })
      res.json({ token, user: { email: userFromDb.email } })
   } catch (error) {
      console.log(error);
      res.status(error.code || 500).json({ msg: error.msg || 'something went wrong' })
   }
});

app.get('/protected', authUser, (req, res) => {
   res.json({ success: true })
});

app.all('*', (req, res) => res.status(404).json({ msg: 'דף לא נמצא יא צוציק' }))


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

// middleware
async function authUser(req, res, next) {
   try {
      const token = req.headers.authorization
      console.log({ token });
      const payload = decodeToken(token)
      console.log({ payload });
      // TODO - check user
      next()
   } catch (error) {
      console.log(error);
      res.status(401).json({ msg: error.msg || 'something went wrong' })
   }
}