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
        Dishes.create(req.body)
            .then((dish)=>{

                // console.log('Dish Created:'+dish)

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

// Routing for dishes/:dishId
dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById({_id: req.params.dishId})
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
                // Format for req: {x
                // console.log('Dish Updated:' + dish)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete((req, res, next) => {
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
    .post((req, res, next) => {
        // console.log(req.params.dishId);Cast to ObjectId failed for value
        // Failing; cast to objectid  failed for value; how to add comment to comment array; How to add json to subdocument;how to parse _id in req.body; with {}/w/o "" ?
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                   
                    dish.comments.push(req.body);
                    dish.save()
                    .then((dish)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);

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
        // cast to object id failed for value; doesn;t work; same rror : Cast to ObjectId failed for value
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
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /dishes/:' + req.params.dishId+'/comments/'+req.params.commentId);
    })
    .put((req, res, next) => {
        // Cannot read property 'body' of undefined
        Dishes.findById(req.params.dishId)
             .then((dish) => {
                 const { commentId } = req.params;
                 console.log(dish.comments);
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    console.log(dish.comments.id(req.params.commentId));
                    if(req.body.rating){
                        dish.comments.id(req.params.commentId).rating = req.body.rating 
                    }
                    if (req.body.comment){
                        dish.comments.id(req.params.commentId).comment = req.body.comment 
                    }
                    console.log(dish);
                    dish.save()
                         .then((updateddish) => {
                             res.statusCode = 200;
                             res.setHeader('Content-Type', 'application/json');
                             res.json(updateddish.comments.id(req.params.commentId));

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
         // does it need req.body to delete or can it do with route itself ?
        // Cast to ObjectId failed for value

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
