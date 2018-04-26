const user_db_actions = require('../user_db_actions');
const creator_db_actions = require('../creator_db_actions');
const category_db_actions = require('../category_db_actions');
var passport = require('passport');
require('../config/passport')(passport); // pass passport for configuration

var cassandra = require('cassandra-driver');
//Connect to the cluster
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'backstage_db' });

const routes = require('express').Router();

routes.get('/', (request, response) => {
  response.render('layouts/main', {
      user : request.user, // get the user out of session and pass to template
      title: 'BackStage'
  })
})

// Users
routes.get('/login', function (req, res) {
  res.render('layouts/signup', { message: req.flash('signupMessage'), user : req.user, title: 'Sign Up / In' });
});

routes.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/login#sectionB', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));
// routes.post('/signin', function (req, res) {
//     var data = user_db_actions.LoadUser(client, req.body.email);
//     if(data){
//         bcrypt.compare(req.body.password, data.password, (err, result) => {
//             if(err) {
//                 return res.status(401).json({
//                     message: 'Auth failed'
//                 })
//             }
//             if(result){
//                 const token = jwt.sign({
//                     email: req.body.email,
//                     userId: data.id
//                 }, 'SECRETKEY', {expiresIn: "1h"});
//                 return res.status(200).json({
//                      message: 'Auth succesfull',
//                      token: token
//                 });
//             }
//         });
//     } else {
//         res.status(401).json({
//             message: 'Auth failed'
//         })
//     }
// });

// process the login form
routes.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

routes.post('/update_user', function (req, res) {
  user_db_actions.UpdateUser(req, res, client);
});
routes.post('/delete_user', function (req, res) {
  user_db_actions.DeleteUser(req, res, client);
});
routes.get('/load_user', function (req, res) {
  user_db_actions.LoadUser(req, res, client);
});

routes.get('/creators', function (req, res) {
  var creators = JSON.parse('{"creators":[{"id":"1", "name":"one","description":"desc1","img_src":"img_src_1"},{"id":"2", "name":"two","description":"desc2","img_src":"img_src_2"},{"id":"3", "name":"three","description":"desc3","img_src":"img_src_3"}]}');
  res.render('layouts/creators', {
      user: req.user, // get the user out of session and pass to template
      creators: creators,
      title: 'Creators'
  });
});
routes.get('/profile', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
  var categories_ids, creators_ids = user_db_actions.LoadCategoriesAndCreators(req.user.email);
  var categories = category_db_actions.LoadCategories(categories_ids);
  var creators = creator_db_actions.LoadCreators(creators_ids);
  res.render('layouts/profile', {
      user: req.user, // get the user out of session and pass to template
      categories: categories,
      creators: creators,
      title: 'Profile'
  });
});

routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

routes.get('/messages', function (req, res) {
  var messages = user_db_actions.LoadMessages(req.user);
  res.render('layouts/messages', {
      user: req.user, // get the user out of session and pass to template
      messages: messages,
      title: 'Messages'
  });
});

routes.get('/categories', function (req, res) {
  var categories = JSON.parse('{"categories":[{"id":"1", "name":"one","description":"desc1","img_src":"img_src_1"},{"id":"2", "name":"two","description":"desc2","img_src":"img_src_2"},{"id":"3", "name":"three","description":"desc3","img_src":"img_src_3"}]}');
  res.render('layouts/categories', {
      user: req.user, // get the user out of session and pass to template
      categories: categories,
      title: 'Categories'
  });
});

routes.get('/categories/:id', function (req, res) {
  // var data = category_db_actions.LoadCategory(client, req.params.id);
  var data = creator_db_actions.LoadCreators(client, req.params.id);
  res.render('layouts/category', {
      user : req.user, // get the user out of session and pass to template
      data: data,
      title: 'Category ' + data.name
  });
});

// Creators
routes.get('/creators/:id', function (req, res) {
  var data = creator_db_actions.LoadCreator(client, req.params.id);
  res.render('layouts/creator', {
      user : req.user, // get the user out of session and pass to template
      data: JSON.parse(data),
      title: data.name
  });
});
routes.get('load_creator', function (req, res) {
  creator_db_actions.LoadCreator(req, res, client);
});
routes.post('insert_creator', function (req, res) {
  creator_db_actions.InsertCreator(req, res, client);
});
routes.post('update_creator', function (req, res) {
  creator_db_actions.UpdateCreator(req, res, client);
});
routes.post('delete_creator', function (req, res) {
  creator_db_actions.DeleteCreator(req, res, client);
});


module.exports = routes;