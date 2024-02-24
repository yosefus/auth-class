const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.error(err));

app.use(cors());

app.use(express.json());

app.post('/register', async (req, res) => {

});

app.all('/test', async (req, res) => {
   res.json({ success: true })
});

app.post('/login', async (req, res) => {

});

app.get('/protected', (req, res) => {

});

app.all('*', (req, res) => res.status(404).json({ msg: 'דף לא נמצא יא צוציק' }))


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
