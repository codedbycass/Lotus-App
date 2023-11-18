const { isBoolean } = require("lodash");
const { ObjectID } = require("mongodb")

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    // don't need to touch this; works as is
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    // this section is the page after you log in. 
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
// navigation bar ===============================================================

    // ABOUT PAGE =========================
    app.get('/about', function(req, res) {
      res.render('about.ejs');
    });

    // HOME PAGE =========================
    app.get('/profile', function(req, res) {
    res.render('profile.ejs');
    });

    // MY ACCT PAGE =========================
    app.get('/account', isLoggedIn, function (req, res) {
      db.collection('personalization').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('account.ejs', {
          personalization: result
        });
      });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// profile page routes ===============================================================
//AMERICAN GOVT QUESTIONS
//this shows all the citizenship questions on DOM
    app.post('/messages', (req, res) => {
      db.collection('messages').save({question: req.body.question, answer: req.body.answer}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })
//PESONALIZAITON SURVEY
//this shows all user inputs on DOM
app.post('/account', (req, res) => {
  db.collection('personalization')
  .save({age: req.body.age, lang:req.body.lang, lpr: req.body.lpr, pb: req.body.pb}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/account')
  })
})
//TRANSLATION UPDATE
//an object appears in shell, but lao fields not replacing eng fields
app.put('/messages', (req, res) => {
  console.log("PUT request received");
  console.log("Request body:", req.body);
  db.collection('messages').findOneAndUpdate(
      { _id: ObjectID(req.body._id) },
      {
          $set: {
              question: req.body.questionlao,
              answer: req.body.answerlao
          }
      },
      { sort: { _id: -1 }, upsert: true },
      (err, result) => {
          if (err) {
              console.error("Database update error:", err);
              return res.send(err);
          }
          console.log("Database update result:", result);
          res.send(result);
      }
  );
});

//currently can't think of a delete operation since users will not be deleting anything
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
