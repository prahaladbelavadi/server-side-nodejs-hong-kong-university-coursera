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
        res.end('PUT operations not supported on /promtions')
    })
    .post((req, res, next)=>{
        res.end('Will add the promo to '+ req.params.name+' with details '+req.body.description)
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
        res.end('Will send details about ' + req.params.dishId + ' to you');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /dishes/:' + req.params.dishId);
    })
    .put((req, res, next) => {
        res.write('Updating the dish: ' + req.params.dishId + '\n');
        res.end('Will update the dish: ' + req.body.name + 'with details ' + req.body.description)
    })
    .delete((req, res, next) => {
        res.end('Deleteing dish: ' + req.params / dishId)
    });

    module.exports = promoRouter;
