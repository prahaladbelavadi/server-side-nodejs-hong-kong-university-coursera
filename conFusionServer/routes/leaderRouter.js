const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

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
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Leaders.find(req.query)

            .then((leaders)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(leaders)
        
            },(err)=>next(err))
            .catch((err)=>next(err))
    })
    .post(cors.corsWithOptions, cors.corsWithOptions, (req, res, next) => {
        Leaders.create(req.body)
        .then((leaders)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders)
        },(err)=>next(err))
        .catch((err)=>next(err));
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
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
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Leaders.findById({ _id: req.params.leaderId})
        .then((leader)=>{
            res.sendStatus= 200; 
            res.setHeader('Content-Type','application/json');
            res.json(leader)
        },(err)=>next(err))
        .catch((err)=>next(err))
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /leaders/:' + req.params.leaderId);
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId,{
            $set:req.body
        },{new:true})
        .then((leader)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        },(err)=>next(err))
        .catch((err)=>next(err))
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json'); 
            res.json(resp);
        })
    });

module.exports = leaderRouter;