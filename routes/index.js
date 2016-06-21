var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var db = mongojs('autiondata',['products']);
var db2 = mongojs('autiondata',['users']);
var passport = require('passport');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var randomstring = require("randomstring");
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "Smtp.gmail.com",
    secureConnection : true,
    port: 587,
    auth : {
        user : "caovi143@gmail.com",
        pass : "Caohungvi1"
    }
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
 var mongoose = require('mongoose');
var passport = require('passport'); 

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

 

		
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* RESTful API */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});


router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

/* Authentication API */
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password || !req.body.email){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
        
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password); 
     user.save(function (err){
    if(err){ 
	console.log(err);
	return next(err); }
		return res.json({token: user.generateJWT()});
    
  });    
});
router.get('/updatepass/:email', function(req, res){
	var email = req.params.email;
	
  if(!email){
    return res.status(400).json({message: 'Xin vui lòng nhập đầy đủ thông tin'});
  }
  
	
	var pass = randomstring.generate({
  length: 12,
  charset: 'alphabetic'
});
  console.log(pass);
  var user = new User();
  user.email = email;

  user.setPassword(pass);
  	User.update({email:email},{$set:{hash: user.hash,salt: user.salt}},{upsert: true},function (err){
    if(err){ 
	console.log(err);
	return next(err); }
	console.log(pass);
	var mailOptions={
        from : "caovi143@gmail.com",
        to : email,
        subject : "Forget Password",
        html : "Your Password: " + pass,
        text : "HTML GENERATED"
        
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
    
  });   
     
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Vui lòng nhập đầy đủ thông tin '});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/history', function(req, res, next) {
	 
	db.products.find({isBID:0},function(err,docs){
		res.json(docs);
	});
});
router.get('/historyFashion', function(req, res, next) {
	 
	db.products.find({isBID:0,typeid:'tt'},function(err,docs){
		res.json(docs);
	});
});
router.get('/historyTechnology', function(req, res, next) {
	 
	db.products.find({isBID:0,typeid:'cn'},function(err,docs){
		res.json(docs);
	});
});
router.get('/historyHot', function(req, res, next) {
	 
	db.products.find({isBID:0,typeid:'hot'},function(err,docs){
		res.json(docs);
	});
});
router.get('/done', function(req, res, next) {
	 
	db.products.find({isBID:1},function(err,docs){
		res.json(docs);
	});
});
router.get('/donehot', function(req, res, next) {
	 
	db.products.find({isBID:1,typeid:'hot'},function(err,docs){
		res.json(docs);
	});
});
router.get('/donefashion', function(req, res, next) {
	 
	db.products.find({isBID:1,typeid:'tt'},function(err,docs){
		res.json(docs);
	});
});
router.get('/donetechnology', function(req, res, next) {
	 
	db.products.find({isBID:1,typeid:'cn'},function(err,docs){
		res.json(docs);
	});
});
router.get('/currentPrice', function(req, res, next) {
	 
	db.products.find({},{costCurent:1,_id:1},function(err,docs){
		res.json(docs);
		
	});
});
router.get('/product/:id', function(req, res) {
  var id = req.params.id;
  console.log('value' + id);
  db.products.find(function(err,docs){
         
       docs.forEach(function(item){
          
		 if(item._id == id){
            res.json(item)
			
		 }
       });
	   
  });
});
router.get('/productrelate/:id', function(req, res) {
  var id = req.params.id;
   
  db.products.find(function(err,docs){
         
       docs.forEach(function(item){
          
		 if(item._id == id){
			 db.products.find({isBID:0,typeid:item.typeid, _id : {$ne:mongojs.ObjectId(id.toString())}}).limit(3,function(err,docs2){	
				 res.json(docs2);
			 })
            
			
		 }
       });
	   
  });
});router.get('/auth/twitter/', passport.authenticate('twitter', {
    failureRedirect: '/#/register',
    session: false
  }));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/#/register',
    successRedirect : '/',
    session: false
  }));


router
  .get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/#/register',
    successRedirect : '/',
    session: false
  }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/#/register',
    successRedirect : '/',
    session: false
  }));

router
  .get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/#/register',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    successRedirect : '/',
    session: false
  }))

  .get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/#/register',
    successRedirect : '/',
    session: false
  }));
module.exports = router;
