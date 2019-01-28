const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Promotions= require('../models/promotions');

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('promoRouter: Connected correctly to the server; testing endpoint: localhost:3000/dishes; mongodbb port: 27017;');
},(err)=>{
    console.log(err);
})

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Promotions.find(req.query)

        .then((promotions)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
        }, (err)=>next(err))
        .catch((err)=>next(err));
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operations not supported on /promotions')
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        Promotions.create(req.body)
        .then((promotions)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotions);
        },(err)=>next(err))
        .catch((err)=>next(err))
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Promotions.remove({})
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        },(err)=>next(err))
        .catch((err)=>next(err))
    });


promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Promotions.findById({_id:req.params.promoId})
        .then((promotion)=>{
            console.log('Promotion Created:'+ promotion)

            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err)=>next(err))
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /promotions/:' + req.params.promoId);
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId,{
            $set:req.body
        },{new:true})
        .then((promotion)=>{
           res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        },(err)=>next(err))
        .catch((err)=>next(err))
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
    });

module.exports = promoRouter;
