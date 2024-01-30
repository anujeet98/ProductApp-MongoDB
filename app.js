const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const {mongoConnect} = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // User.findById(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => console.log(err));
    next();
});

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

async function connectMongoBb() {
  try{
    await mongoConnect();
    app.listen(3000);
  }
  catch(err){console.log(err);  } 
}

connectMongoBb();