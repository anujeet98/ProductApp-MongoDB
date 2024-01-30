const mongodb = require('mongodb');
const {MongoClient} = mongodb;

let _db;

const mongoConnect = async() => {
    try{
        const client = await MongoClient.connect(`mongodb+srv://anujeet98:Hk42VvtrhbulVyXP@cluster0.ijrpm3b.mongodb.net/?retryWrites=true&w=majority`)
        console.log('connected to mongoDb!');
        _db = client.db('shop');  //database name
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const getDb = () => {
    if(_db)
        return _db;

        throw 'no db found';
}


module.exports = {
    mongoConnect,
    getDb
};
