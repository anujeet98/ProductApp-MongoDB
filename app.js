const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
// const {mongoConnect} = require('./util/database');
const mongoose = require('mongoose');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async(req, res, next) => {
    try{
        // const user = await User.findById('65b94852940a10870043a1d0');  
        // req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    }
    catch(err){
        console.error(err);
    }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

async function connectMongoBb() {
  try{
    // await mongoConnect();
    const result = await mongoose.connect('mongodb+srv://anujeet98:Hk42VvtrhbulVyXP@cluster0.ijrpm3b.mongodb.net/shop?retryWrites=true&w=majority');
    app.listen(3000);
  }
  catch(err){console.log(err);  } 
}

connectMongoBb();