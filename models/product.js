const mongodb = require('mongodb');
const {getDb} = require('../util/database');

class Product{
    constructor(title, price, imageUrl, description, id, userId){
		this.title = title;
		this.price = price;
		this.imageUrl = imageUrl;
		this.description = description;
		this._id = id ? new mongodb.ObjectId(id): null;
		this.userId = userId;
	}

	save(){
		try{
			const db = getDb();
			if(this._id){
				//if id present => update product
				return db.collection('Products').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this});
			}
			else{
				//no id => for create new product
				return db.collection('Products').insertOne(this);
			}
		}
		catch(err){
			console.error(err);
		}
	}

	static fetchAll(){
		try{
			const db = getDb();
			return db.collection('Products').find().toArray();
		}
		catch(err){
			console.error(err);
		}
	}

	static findById(prodId){
		try{
			const db = getDb();
			return db.collection('Products').find({_id: new mongodb.ObjectId(prodId)}).next();  //returns cursor so use the next() which will give the last document ie. only one here
		}
		catch(err){
			console.error(err);
		}
	}

	static deleteOne(prodId){
		try{
			const db = getDb();
			return db.collection('Products').deleteOne({_id: new mongodb.ObjectId(prodId)});
		}
		catch(err){
			console.error(err);
		}
	}
}


module.exports = Product;
