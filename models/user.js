
const mongodb = require('mongodb');
const {getDb} = require('../util/database');

class User{
    constructor(name, email, cart, id){
        this.name = name;
        this.email = email;
        this.cart = cart ? cart: {'items':[]};  //{items: []}

        this._id = new mongodb.ObjectId(id);
    }

    save(){
        try{
            const db = getDb();
            return db.collection('Users').insertOne(this);
        }
        catch(err){
            console.error(err);
        }
    }

    addToCart(product){
        try{
            const db = getDb();
            
            const updatedCartItems = [...this.cart.items];

            const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());

            if(cartProductIndex !== -1){
                updatedCartItems[cartProductIndex].quantity++;
            }
            else{
                updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: 1});
            }

            const updatedCart = {
                items: updatedCartItems
            };
            return db.collection('Users').updateOne(
              {_id: new mongodb.ObjectId(this._id)}, 
              {$set: {cart: updatedCart}
            });
        }
        catch(err){
            console.log(err);
        }
    }

    static findById(userId){
        try{
          const db = getDb();
          return db.collection('Users').findOne({_id: new mongodb.ObjectId(userId)});  //no next needed as using findOne so only one user. use next with find()
        }
        catch(err){
            console.error(err);
        }
    }


}

module.exports = User;
