const { isBoolean } = require("lodash");

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

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// profile page routes ===============================================================

//this shows all the citizenship questions on DOM
    app.post('/messages', (req, res) => {
      db.collection('messages').save({question: req.body.question, answer: req.body.answer}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })
//put operation: when users click the language button it will replace all the english flashcards with lao flashcards; event listener will need to be on lang-btn
app.put('/messagesLao', (req, res) => {
    db.collection('messages').findOneAndUpdate({questionlao: req.body.question, answerlao: req.body.answer}, (err, result) => {
      if (err) return console.log(err)
      
      res.redirect('/profile')
    })
  })
//Create operation on "My account" route /myaccount : users will input survey info. Based on this info, they can see if they qualify for the citizenship test; else they will be told conditions to qualify. Will be given a study plan regardless.
app.post('/studyplan', (req, res) => {
    db.collection('lotusAcct') // create a new collection that has user info name, age, greencard holder, public benefits, language
    .save({name: req.body.name, age: req.body.age, LPRstatus: req.body.lpr, publicBenefits: req.body.pb, language: req.body.language})
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/profile')
  })

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
