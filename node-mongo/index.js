const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dboper = require('./operations')

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';


MongoClient.connect(url).then((client)=>{
    assert.equal(err,null);
    
    console.log('connected to server');

    const db = client.db(dbname);

    dboper.insertDocument(db, {name:"vadonut", description: 'test'}, 'dishes')
        .then((result)=>{

            console.log('insert document:\n', result.ops)

            return dboper.findDocuments(db, 'dishes')
        }) 
        .then((docs)=>{
            console.log('Found Documents:\n', docs);

            return dboper.updateDocument(db, { name: 'vadonut' }, { description: 'Updated test' }, 'dishes');
        })
        .then((result)=>{
            console.log('Updated document:\n', result);

            return dboper.findDocuments(db, 'dishes');
        })
        .then(((docs) => {
            console.log('Found Documents:\n', docs);
                
            db.dropCollection('dishes')
        })
        .then((result)=>{
                console.log('Dropped collection: '+ result);
                client.close();      
        })
.catch((err)=>{console.log('err');
    }).catch((err)=>{console.log(err)});