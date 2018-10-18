var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users'])
var ObjectId = mongojs.ObjectId;
// Initialise app to express function
var app = express();

// var logger = function(req, res, next){
//     console.log('Logging....');
//     next();
// }
// Be able to use this middleware
// app.use(logger);

// View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set static path
app.use(express.static(path.join(__dirname,'public')));

// Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter:function(param, msg, value){
        var namespace = param.split('.'),
        root     = namespace.shift(),
        formParam  = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param:formParam,
            msg:msg,
            value:value
        };
    }
}));
// var users = [
//     {
//         id:1,
//         first_name:'Francis',
//         last_name:'Kiryowa',
//         email:'francis@gmail.com'
//     },
//     {
//         id:2,
//         first_name:'Noah',
//         last_name:'Kalyesubula',
//         email:'noah@gmail.com'
//     },
//     {
//         id:3,
//         first_name:'Hope',
//         last_name:'Naluwooza',
//         email:'hope@gmail.com'
//     }

// ]
app.get('/',function(req, res){
    // find everything
db.users.find(function (err, docs) {
    // docs is an array of all the documents in mycollection
    console.log(docs);
    // res.send('Hello');
    var title = 'Customers';
    res.render('index',{
        title:"Customers",
        users:docs
    });

});
    
});


// Handle posted data from the form
app.post('/users/add',function(req,res){
    // Validations
    req.checkBody('first_name','First Name is Required').notEmpty();
    req.checkBody('last_name','Last Name is Required').notEmpty();
    req.checkBody('email','Email is Required').notEmpty();

    var errors = req.validationErrors();
    if(errors) {
        res.render('index',{
            title:"Customers",
            users:users,
            errors:errors
        });
    }else {
        var new_user = {
            'first_name':req.body.first_name,
            'last_name':req.body.last_name,
            'email':req.body.email
        }
        // delete req.body.first_name;
        // console.log(req.body['first_name']);
        db.users.insert(new_user, function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        })

    }
   
    
});

app.delete('/users/delete/:id',function(req,res){
    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
       if(err){
        console.log(err);
       }
       res.redirect('/');
    })
});


app.listen(9999,function(){
   console.log('Server started on port 9999....');
});