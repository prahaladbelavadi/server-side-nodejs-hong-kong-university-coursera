const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req,res, next)=>{
        res.code = 200;
        res.setHeader = ('Content-Type','text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('will send all promotions to yuo');
    })
    .put((req,res,next)=>{
        res.statusCode= 403;
        res.end('PUT operations not supported on /promotions')
    })
    .post((req, res, next)=>{
        res.end('Will add the promo to '+ req.body.name +' with details '+req.body.description)
    })
    .delete((req,res,next)=>{
        res.end('Deleting all promos');
    });


promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send details about ' + req.params.promoId + ' to you');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /promotions/:' + req.params.promoId);
    })
    .put((req, res, next) => {
        res.write('Updating the promotion: ' + req.params.promoId + '\n');
        res.end('Will update the promotion: ' + req.body.name + 'with details ' + req.body.description)
    })
    .delete((req, res, next) => {
        res.end('Deleteing promotion: ' + req.params.promoId)
    });

    module.exports = promoRouter;
