const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var config = require('../config');
var authenticate = require('../authenticate');


const Dishes =  require('../models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url, { useNewUrlParser: true });

connect.then((db) => {
    console.log('DishRouter: Connected correctly to the server; testing endpoint: localhost:3000/dishes; mongodbb port: 27017;');
}, (err) => {
    console.log(err);
})

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')

    .get((req, res, next) => {
        Dishes.find({})
        .populate('comments.author')
            .then((dishes)=>{

                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dishes);
            
            },(err)=>next(err))
            .catch((err)=>next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdminUser ,(req, res, next) => {     
        Dishes.create(req.body)
            .then((dish)=>{

                console.log('Dish Created:'+ dish)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish) ;
                
            }, (err) => next(err))
                .catch((err) => next(err))

    })
    .put(authenticate.verifyUser, authenticate.verifyAdminUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdminUser ,(req, res, next) => {
          Dishes.remove({})
            .then((resp)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
                .catch((err) => next(err))
    });

// Routing for dishes/:dishId
dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById({_id: req.params.dishId})
            .populate('comments.author')
                .then((dish) => {
                    console.log('Dish Created:' + dish)
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdminUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /dishes/:' + req.params.dishId);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdminUser,(req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId,{
            $set:req.body
        },{new:true})
            .then((dish) => {
                // Format for req: {x
                // console.log('Dish Updated:' + dish)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdminUser,(req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                // need to send confirmation that dish has been deleted{n:1}
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);//sends deleted object; not confirmation

            }, (err) => next(err))
            .catch((err) => next(err))
    });


    // supporting route for /localhost:300/dishes/:dishId/comments 

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        console.log('into get request');
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if(dish != null){

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);

                }else{
                    err = new Error('Comments of '+req.params.dishId+' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,(req, res, next) => {
            Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                   req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                    .then((dish)=>{
                        Dishes.find(dish)
                        .populate('comments.author')
                        .then((dish)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        })
                    }, (err)=> next(err));
                     
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))

    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/'+ req.params.dishId+'/comments');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Dishes.findById(req.params.dishId)
        .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i>=0; i--){
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        
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
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId )!=null) {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));

                } else if (dish ==null){
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err);
                }
                
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found')
                    err.status = 404;
                    return next(err);
                }
               
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /dishes/:' + req.params.dishId+'/comments/'+req.params.commentId);
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        Dishes.findById(req.params.dishId)
             .then((dish) => {
                 const { commentId } = req.params;
                 console.log(dish.comments);
                 if (dish != null && dish.comments.id(req.params.commentId) != null && (dish.comments._id(req.params.commentId).author === req.user._id)) {
                    console.log(dish.comments.id(req.params.commentId));
                    if(req.body.rating){
                        dish.comments.id(req.params.commentId).rating = req.body.rating 
                    }
                    if (req.body.comment){
                        dish.comments.id(req.params.commentId).comment = req.body.comment 
                    }
                    console.log(dish);
                    dish.save()
                         .then((dish) => {
                             Dishes.findById(dish._id)
                             .populate('comments.author')
                             .then((dish)=>{
                                 res.statusCode = 200;
                                 res.setHeader('Content-Type', 'application/json');
                                 res.json(dish);
                             })
                         }, (err) => next(err));

                 } else if (dish == null) {
                     err = new Error('Dish ' + req.params.dishId + ' not found')
                     err.status = 404;
                     return next(err);
                 }
                 else if (dish.comments.id(req.params.commentId) == null)  {
                     err = new Error('Comment ' + req.params.commmentId + ' not found')
                     err.status = 404;
                     return next(err);
                 }else {
                     err = new Error('You are not Authorized to perform this operation!');
                     err.status = 403;
                     return next(err);
                 }
             }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
         Dishes.findById(req.params.dishId)

            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    
                        dish.comments.id(req.params.commentId).remove();
                    
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
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
