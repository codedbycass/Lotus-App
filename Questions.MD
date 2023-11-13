// routes.js file
Not sure where to locate /profile route, and how isLoggedIn is working?
```
// PROFILE SECTION ========================= 
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
```

//vscode folder
holding settings.json files 

//app folder
all the stuff you need for application; has models how to talk to databases and routes (the full api handling all requests coming in)

// in the config folder
links to db js file, and passport js file copy and paste from their website everything needed for authentication - off the shelf ready to use authentication

// node modules
all modules needed for app to run; npm install

//public 
all static client side files

//views
all ejs templates are going to reside; every single page in application has its own view ejs file; renders what user sees

//gitignore
all stuff not to be pushed up to github

//license file 
what can they do with code

//package.json package.lock

//procfile
to get on heroku

//server.js 
setting up server
    //express, app
    //port setting up port
    //mongo client to talk to db
    //mongoose how to really talk to db
    //passport for authentication
    //flash for error messages
    //morgan how to log in terminal - dev dep
    //cookieparser enables us to look at logged in sessions
    //bodyparser stuff that comes along with form submission - going forward built into express
    //config require db js file; which is really an obj
    //db variable

    //mongoose.connect setting up to mongodb 
    // require('./app/routes.js')(app, passport, db) exports a function; see it as a function(with,params,here)

Any file that goes in these folders are served, no need to individually route:
    //app.use(express.static('public'))
    //app.set('view engine', 'ejs')

//app folder 
// models
    //the only ability to talk to db; schema helps us keep docs consistent
    //hash encrypts pw
//routes
    //api
    //middle ware isLoggedIn if user is logged in they will go next, otherwise redirect back to home page; if user is logged in every req will send uername
    // PROFILE SECTION ========================= 
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });