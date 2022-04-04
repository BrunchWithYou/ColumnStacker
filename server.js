const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const LeaderboardModel = require('./models/leaderboardmodel');
require('dotenv').config()
const PORT = process.env.PORT || 8050

mongoose.connect(
     process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => {console.log("Connected to db!");}
)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connection established');
});

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.get('/', async (request, response) => {
  try {
    LeaderboardModel.find({})
    .sort({ score: -1 })
    .exec((err, entries) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      response.render("index.ejs", { entries });
    });
  } catch (error) {
    response.status(500).send({message: error.message})
  }
})

app.post('/leaderboard', (req, res) => {
  const leaderboard = new LeaderboardModel({
    userName: req.body.userName,
    score: req.body.score
  });

  return leaderboard.save()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log(error);
    });
});

app.get("/leaderboard", (req, res) => {
  LeaderboardModel.find({})
    .sort({ score: -1 })
    .exec((err, entries) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.json({ entries });
    });
});

//PORT = 8050
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})