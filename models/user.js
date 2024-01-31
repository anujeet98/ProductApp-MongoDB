const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/product');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true},
            }
        ],
    }
});

UserSchema.methods.addToCart = async function (product){
    try{
        const cartItems = this.cart.items;

        const cartProductIndex = cartItems.findIndex(cp => cp.productId.toString() === product._id.toString());

        if(cartProductIndex !== -1){
            cartItems[cartProductIndex].quantity++;
        }
        else{
            cartItems.push({productId: product._id, quantity: 1});
        }

        return await this.save();
    }
    catch(err){
        console.error(err);
    }
}

module.exports = mongoose.model('User', UserSchema);


// const mongodb = require('mongodb');
// const {getDb} = require('../util/database');

// class User{
//     constructor(name, email, cart, id){
//         this.name = name;
//         this.email = email;
//         this.cart = cart ? cart: {'items':[]};  //{items: []}

//         this._id = new mongodb.ObjectId(id);
//     }
//     deleteCartItem(prodId){
//         try{
//             const db = getDb();
//             const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== prodId.toString());
//             const updatedCart = {items: updatedCartItems};
//             return db.collection('Users').updateOne(
//                 {_id: new mongodb.ObjectId(this._id)}, 
//                 {$set: {cart: updatedCart}}
//             );
//         }   
//         catch(err){
//             console.error(err);
//         }
//     }

//     async addOrder(){
//         try{
//             const db = getDb();
//             const cartProducts = await this.getCartItems();
//             const order = {
//                 products: cartProducts,
//                 userId: new mongodb.ObjectId(this._id)
//             }
//             await db.collection('Orders').insertOne(order);

//             this.cart.items = [];

//             await db.collection('Users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: this.cart}});

//         }
//         catch(err){
//             console.error(err);
//         }
//     }

//     getOrders(){
//         try{
//             const db = getDb();
//             return db.collection('Orders').find({userId: new mongodb.ObjectId(this._id)}).toArray();
//         }
//         catch(err){
//             console.error(err);
//         }
//     }




// }

