const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');

const url =  'mongodb://localhost:27017/conFusion'
const connect  = mongoose.connect(url);

connect.then((db) => {
    console.log('leaderRouter: Connected correctly to the server; testing endpoint: localhost:3000/dishes; mongodbb port: 27017;');
}, (err) => {
    console.log(err);
})

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})

            .then((leaders)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(leaders)
        
            },(err)=>next(err))
            .catch((err)=>next(err))
    })
    .post((req, res, next) => {
        Leaders.create(req.body)
        .then((leaders)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders)
        },(err)=>next(err))
        .catch((err)=>next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        Leaders.remove({})
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
        }, (err) => next(err))
            .catch((err) => next(err))
        });

// // assignment - 1
leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send details about ' + req.params.leaderId + ' to you');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /leaders/:' + req.params.leaderId);
    })
    .put((req, res, next) => {
        res.write('Updating the leader: ' + req.params.leaderId + '\n');
        res.end('Will update the leader: ' + req.body.name + ' with details ' + req.body.description)
    })
    .delete((req, res, next) => {
        res.end('Deleteing leader: ' + req.params.leaderId)
    });


module.exports = leaderRouter;