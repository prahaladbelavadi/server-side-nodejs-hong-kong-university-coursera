const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes =  require('../models/dishes');

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url, { useNewUrlParser: true });

connect.then((db) => {
    console.log('Connected correctly to the server; mongodbb port: 27017; testing endpoint: localhost:3000/dishes ');
}, (err) => {
    console.log(err);
})

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')

    .get((req, res, next) => {
        Dishes.find({})
        
            .then((dishes)=>{

                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dishes);
            
            },(err)=>next(err))
            .catch((err)=>next(err));
    })
    .post((req, res, next) => {     
        console.log(req.body);   
        Dishes.create(req.body)
            .then((dish)=>{

                console.log('Dish Created:'+dish)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish) ;
                
            }, (err) => next(err))
                .catch((err) => next(err))

    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res, next) => {
          Dishes.remove({})
            .then((resp)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
                .catch((err) => next(err))
    });


// // assignment - 1
dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {

                console.log('Dish Created:' + dish)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /dishes/:' + req.params.dishId);
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId,{
            $set:req.body
        },{new:true})
            .then((dish) => {
// Need to understand how $set update works; can't verify how this works
                console.log('Dish Updated:' + dish)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {

                console.log('Dish Deleted:' + dish)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);

            }, (err) => next(err))
            .catch((err) => next(err))
    });


    // supporting route for /localhost:300/dishes/:dishId/comments 

    dishRouter.route('/:dishId/comments')
// get route note working on this route;
// dish isn't defined
    .get((req, res, next) => {
        console.log(req)
        Dishes.findById({ _id:req.params.dishId})

            .then((dishes) => {
                if(dish != null){

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dishes.comments);

                }else{
                    err = new Error('Dish '+req.params.dishId+' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        console.log(req.params.dishId);
        Dishes.findById(req.body)
            .then((dish) => {
                if (dish != null) {
                   
                    dish.comments.push(req.body);
                    dish.save()
                    .then((dish)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dishes);

                    }, (err)=> next(err));
                     
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))

    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/'+ req.params.dishId+'/comments');
    })
    .delete((req, res, next) => {
        Dishes.findById(req.body)

        .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i>=0; i--){
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dishes);
                        
                        }, (err) => next(err));

                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    });


    // supporting route for /localhost:300/dishes/:dishId/comments/:comments
dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId )!=null) {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dishes.comments.id(req.params.commentId));

                } else if (dish ==null){
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }
                
                else {
                    err = new Error('Comment ' + req.params.commmentId + ' not found')
                    err.status = 404;
                    return next(err);
                }
               
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /dishes/:' + req.params.dishId+'/comments/'+req.params.commentId);
    })
    .put((req, res, next) => {
        Dishes.findById(req.params.dishId)
             .then((dish) => {
                 
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if(req.body.rating){
                        dish.comments.id(req.params.commentId).req.body.rating 
                    }
                    if (req.body.comment){
                        dish.comments.id(req.params.commentId).req.body.comment 
                    }
                    dish.save()
                         .then((dish) => {
                             res.statusCode = 200;
                             res.setHeader('Content-Type', 'application/json');
                             res.json(dishes);

                         }, (err) => next(err));

                 } else if (dish == null) {
                     err = new Error('Dish ' + req.params.dishId + ' not found')
                     err.status = 404;
                     return next(err);
                 }

                 else {
                     err = new Error('Comment ' + req.params.commmentId + ' not found')
                     err.status = 404;
                     return next(err);
                 }

             }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete((req, res, next) => {
         Dishes.findById(req.body)

            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    
                        dish.comments.id(req.params.commentId).remove();
                    
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dishes);

                        }, (err) => next(err));

                } else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }

                else {
                    err = new Error('Comment ' + req.params.commmentId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    });

module.exports = dishRouter;
