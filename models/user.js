
const mongodb = require('mongodb');
const {getDb} = require('../util/database');

class User{
    constructor(name, email, id){
        this.name = name;
        this.email = email;
        // this._id = new mongodb.ObjectId(id);
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
