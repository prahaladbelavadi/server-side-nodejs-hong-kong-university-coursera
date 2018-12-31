const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dboper = require('./operations')

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';


MongoClient.connect(url, (err,client)=>{
    assert.equal(err,null);
    
    console.log('connected to server');

    const db = client.db(dbname);

    dboper.insertDocument(db, {name:"vadonut", description: 'test'}, 'dishes', (result)=>{

        console.log('insert document:\n', result.ops)

        dboper.findDocuments(db, 'dishes', (docs)=>{
            console.log('Found Documents:\n', docs);

            dboper.updateDocument(db, { name: 'vadonut' }, { description: 'Updated test' }, 'dishes',(result)=>{
                console.log('Updated document:\n', result)

                dboper.findDocuments(db, 'dishes', (docs) => {
                    console.log('Found Documents:\n', docs);
                
                    db.dropCollection('dishes', (result)=>{
                        console.log('Dropped collection: '+ result);
                    });
                });
            });
        });
    });
});