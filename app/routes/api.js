var User = require('../models/user'); // Import User Model
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'harrypotter'; // Create custom secret for use in JWT
var Chaine = require ('../models/chaine');
var Channel = require ('../models/channel');
var History = require ('../models/history');
var Abonnement = require ('../models/abonnement');
var http = require('http');
var Struct = require('struct'); 
var json = require('json-object').setup(global);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var express = require('express'); 
var app = express();

//////restful cosumption 
var bouq="";    
var chaine="";
var Token="";
var Tokenrecepteur="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWhtZWRiaGQiLCJleHAiOjE1MjczNzgxODksImp0aSI6IkFobWVkYmhkLTYifQ.zk9wMnnYifOuuYTqpRNg5BicgoE0f0NQm_qz2OgNz0h9WuBi9fj8FxB7fCd4hKdVb_ujwtkMdPXKNSfGucaiIg";
/* var History = Struct()
	.chars('recepteur',10)
    .chars('bouquet',10)
    .chars('channel',10)
    .chars('program',10)
    .datetime('date',10);
 */


////////////// socket.io

//var server = http.createServer(app);
var io = require("socket.io").listen(8088).sockets;

io.on("connection",function(socket){
console.log("client connected ")
    socket.on("input",function(data){
        addHistory(data);

         MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("history").find({}).toArray( function(err, result) {
              if (err) throw err;
              console.log("data "+[data]);
              //var jsonString = JSON.stringify(result[0]);
              socket.broadcast.emit("output",result);
              db.close();
            });
          }); 

        /*   console.log("data "+[data]);
          socket.emit("eveneeeennt");
         socket.broadcast.emit("output",[data]); */
    })
    

});


function addHistory(data){
    var datetime = new Date();
    var channel = data;
    var channel_name = channel.nom_chaine;
    var recepteur = channel.recepteur;
    var program ="";
    var duree = channel.duree;
    console.log(channel);
    /* var data = {
        recepteur:recepteur,
        bouquet:"",
        channel:channel_name,
        program:"",
        date:datetime,
        duree:duree
    }; */
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("testhoussem");
    
        dbo.collection("channel").find({name:channel_name}).toArray(function(err, resl) {
        if (err) throw err;
        dbtab= resl;
        if (resl[0]){
            console.log(resl[0].current_program);

            data = {recepteur:recepteur,
                bouquet:resl[0].bouquet,
                channel:channel_name,
                program:resl[0].current_program,
                date:datetime,
                duree:duree
            };
            console.log(data);
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("testhoussem");
            
                dbo.collection("history").insertOne(data, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                
                db.close();
                });
            }); 

            //res.json(data)
        }
        db.close();
        });
    }); 

    var arr = [ 'frensh', 'tunisia'];
    var bouq ="";
    
    arr.forEach(function(b) {
    
        b=b.replace(/ /g, "%20");  
        c=channel_name.replace(/ /g, "%20");  
        var t ="";
        if (Token==""){
            t=Tokenrecepteur;
        }else{
            t=Token;
        }
        var options = {
            host: 'localhost',
            port: 8000 ,
            path: '/admin/main/now?bouq='+b+'&channel='+c,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 
                    'Bearer '+t
                }      
        };
            getJSONBouq(options, function(err,result){
            if(err){
                //res.sendStatus(403);
                return console.log('error while trying to get call go: ',err);
                throw err
            }
            //var resu = json.parse(result);
            //console.log(json.stringify(result));
            var resu = json.parse(json.stringify(result));
            var resu1 = (resu.message);
            var resu2 = (resu.Program);
            console.log(resu.message);
            console.log(resu.Program);
            if (resu1 =='missing or malformed jwt')
                return console.log('error while trying to get call go: ',err);
                
                if (resu2 !=''){
                    //console.log("hi2");
                    bouq =b;
                    program = resu.Program;
                    
                    data = {recepteur:recepteur,
                        bouquet:b,
                        channel:channel_name,
                        program:program,
                        date:datetime,
                        duree:duree
                    };
                    console.log(data);
                    MongoClient.connect(url, function(err, db) {
                        if (err) throw err;
                        var dbo = db.db("testhoussem");
                    
                        dbo.collection("history").insertOne(data, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                        
                        db.close();
                        });
                    }); 
                        
                    //res.json(data)
                    return console.log('channel found in go : ', channel_name);
                    
                }
            

            })  
      
    });
}



 ////// using the go api
 function getJSONBouq (options , callback){
    //console.log(options);

     http.request(options,function(res){
        var body ='';
        res.on('data',function(chunk){
            body+=chunk;
        });

        res.on('end',function(){
            var result = JSON.parse(body);
            callback (null,result);
        });

        res.on('error',callback);
    })
    .on('error',callback)
    .end(); 

   
}





module.exports = function(router) {


   
    router.get('/managementhistory', function(req, res) {
        console.log("history")
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("history").find({}).toArray( function(err, result) {
              if (err) throw err;
              res.json(result);
              db.close();
            });
          });
    
    
    });
    /////////login Go/////////
    function LoginGo (options , callback){
        //console.log(options);
    
         http.request(options,function(res){
            var body ='';
            res.on('data',function(chunk){
                body+=chunk;
            });
    
            res.on('end',function(){
                if (body=='Your username or password were wrong'){
                    return '';
                }
                var result = JSON.parse(body);
                callback (null,result);
            });
    
            res.on('error',callback);
        })
        .on('error',callback)
        .end(); 
    
       
    }
    // var client = nodemailer.createTransport(sgTransport(options)); // Use if using sendgrid configuration
    // End Sendgrid Configuration Settings  

// Route for user logins
router.post('/authenticate', function(req, res) {
    var loginUser = (req.body.username).toLowerCase(); // Ensure username is checked in lowercase against database
    User.findOne({ username: loginUser }).select('email username password active permission').exec(function(err, user) {
        if (err) {
            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
           
            res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
        } else {
            // Check if user is found in the database (based on username)           
            if (!user) {
                res.json({ success: false, message: 'Username not found' }); // Username not found in database
            } else if (user) {
                // Check if user does exist, then compare password provided by user
                if (!req.body.password) {
                    res.json({ success: false, message: 'No password provided' }); // Password was not provided
                } else {
                    var validPassword = user.comparePassword(req.body.password); // Check if password matches password provided by user 
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password in database
                    } else if (!user.active) {
                        res.json({ success: false, message: 'Account is not yet activated. Please check your e-mail for activation link.', expired: true }); // Account is not activated 
                    } else {
                        
                           //////// login Go for admin only
                            /////////Calling the LoginGO
                            console.log(user.username+" "+user.password+" "+validPassword);
                            var options = {
                                host: 'localhost',
                                port: 8000 ,
                                path: '/login?username='+user.username+'&password='+req.body.password,
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };
                            
                            LoginGo(options, function(err,result){
                        
                                if(err){
                                    //res.sendStatus(403);
                                    return console.log('error while trying to login go: ',err);
                                }
                                //res.json(result );
                                Token=result.token;
                                console.log(Token);
                            })
                        

                        //// getting the token to access the server
                        var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Logged in: Give user token
                        res.json({ success: true, message: 'User authenticated!', token: token , username: user.username , permission: user.permission}); // Return token in JSON object to controller                  
                    }
                }
            }
        }
    });
});


    
    // Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token']; // Check for token in body, URL, or headers

        // Check if token is valid and not expired  
        if (token) {
            // Function to verify token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
                } else {
                    req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
                    next(); // Required to leave middleware
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
        }
    });


    // Route to register new users  
    router.post('/users', function(req, res) {
        var user = new User(); // Create new User object
        user.username = req.body.username; // Save username from request to User object
        user.password = req.body.password; // Save password from request to User object
        user.email = req.body.email; // Save email from request to User object
        user.name = req.body.name; // Save name from request to User object
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail

        // Check if request is valid and not empty or null
        if (req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '' || req.body.name === null || req.body.name === '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            // Save new user to database
            user.save(function(err) {
                if (err) {
                    // Check if any validation errors exists (from user model)
                    if (err.errors !== null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); // Display error in validation (username)
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                        } else {
                            res.json({ success: false, message: err }); // Display any other errors with validation
                        }
                    } else if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); // Display error if username already taken
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
                            }
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    }
                } else {
                    
                    res.json({ success: true, message: 'Account registered! Please check your e-mail for activation link.' }); // Send success message back to controller/request
                }
            });
        }
    });
     router.post('/chaines', function(req, res) {
        var chaine = new Chaine(); // Create new User object
        chaine.nomchaine = req.body.nomchaine; // Save username from request to User object
        chaine.nb_tele = req.body.nb_tele; // Save password from request to User object
        chaine.picture = req.body.picture; // Save email from request to User object
        chaine.frequence = req.body.frequence; // Save name from request to User object
      // Create a token for activating account through e-mail

        // Check if request is valid and not empty or null
        if (req.body.nomchaine == null || req.body.nomchaine == '' || req.body.nb_tele == null || req.body.nb_tele == '' || req.body.picture == null || req.body.picture == '' || req.body.frequence == null || req.body.frequence == '') {
            res.json({ success: false, message: 'Ensure nomchaine, nb_tele,  and frequence were provided' });
        } else {
            // Save new user to database
            chaine.save();
          
        }
    });

    router.post('/abonnements', function(req, res) {
        var abonnement = new Abonnement();
        abonnement.duree_abonnement = req.body.duree_abonnement;
        abonnement.type_abonnement = req.body.type_abonnement;
        abonnement.active = req.body.active;
        

        // Check if request is valid and not empty or null
        if (req.body.duree_abonnement == null || req.body.duree_abonnement == '' || req.body.type_abonnement == null || req.body.type_abonnement == '' || req.body.active == null || req.body.active == '') {
            res.json({ success: false, message: 'Ensure duree_abonnement, type_abonnement,  and active were provided' });
        } else {
            // Save new user to database
            abonnement.save();
          
        }
    });

    // Route to check if username chosen on registration page is taken
    router.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                    to: 'gugui3z24@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
              
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That username is already taken' }); // If user is returned, then username is taken
                } else {
                    res.json({ success: true, message: 'Valid username' }); // If user is not returned, then username is not taken
                }
            }
        });
    });



    // Route to check if e-mail chosen on registration page is taken    
    router.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
              
                // Function to send e-mail to myself
               
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That e-mail is already taken' }); // If user is returned, then e-mail is taken
                } else {
                    res.json({ success: true, message: 'Valid e-mail' }); // If user is not returned, then e-mail is not taken
                }
            }
        });
    });

    
    // Route to activate the user's account 
    router.put('/activate/:token', function(req, res) {
        User.findOne({ temporarytoken: req.params.token }, function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
              
                
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                var token = req.params.token; // Save the token from URL for verification 
                // Function to verify the user's token
                jwt.verify(token, secret, function(err, decoded) {
                    if (err) {
                        res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                    } else if (!user) {
                        res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                    } else {
                        user.temporarytoken = false; // Remove temporary token
                        user.active = true; // Change account status to Activated
                        // Mongoose Method to save user into the database
                        user.save(function(err) {
                            if (err) {
                                console.log(err); // If unable to save user, log error info to console/terminal
                            } else {
                                // If save succeeds, create e-mail object
                                var email = {
                                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                    to: user.email,
                                    subject: 'Account Activated',
                                    text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                                    html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                                };
                                // Send e-mail object to user
                                client.sendMail(email, function(err, info) {
                                    if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
                                });
                                res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
                            }
                        });
                    }
                });
            }
        });
    });

    // Route to verify user credentials before re-sending a new activation link 
    router.post('/resend', function(req, res) {
        User.findOne({ username: req.body.username }).select('username password active').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                    to: 'gugui3z24@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                // Check if username is found in database
                if (!user) {
                    res.json({ success: false, message: 'Could not authenticate user' }); // Username does not match username found in database
                } else if (user) {
                    // Check if password is sent in request
                    if (req.body.password) {
                        var validPassword = user.comparePassword(req.body.password); // Password was provided. Now check if matches password in database
                        if (!validPassword) {
                            res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password found in database
                        } else if (user.active) {
                            res.json({ success: false, message: 'Account is already activated.' }); // Account is already activated
                        } else {
                            res.json({ success: true, user: user });
                        }
                    } else {
                        res.json({ success: false, message: 'No password provided' }); // No password was provided
                    }
                }
            }
        });
    });

    // Route to send user a new activation link once credentials have been verified
    router.put('/resend', function(req, res) {
        User.findOne({ username: req.body.username }).select('username name email temporarytoken').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                    to: 'gugui3z24@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Give the user a new token to reset password
                // Save user's new token to the database
                user.save(function(err) {
                    if (err) {
                        console.log(err); // If error saving user, log it to console/terminal
                    } else {
                        // If user successfully saved to database, create e-mail object
                        var email = {
                            from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                            to: user.email,
                            subject: 'Activation Link Request',
                            text: 'Hello ' + user.name + ', You recently requested a new account activation link. Please click on the following link to complete your activation: https://immense-dusk-71112.herokuapp.com/activate/' + user.temporarytoken,
                            html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://www.herokutestapp3z24.com/activate/' + user.temporarytoken + '">http://www.herokutestapp3z24.com/activate/</a>'
                        };
                        // Function to send e-mail to user
                        client.sendMail(email, function(err, info) {
                            if (err) console.log(err); // If error in sending e-mail, log to console/terminal
                        });
                        res.json({ success: true, message: 'Activation link has been sent to ' + user.email + '!' }); // Return success message to controller
                    }
                });
            }
        });
    });

    // Route to send user's username to e-mail
    router.get('/resetusername/:email', function(req, res) {
        User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: err }); // Error if cannot connect
            } else {
                if (!user) {
                    res.json({ success: false, message: 'E-mail was not found' }); // Return error if e-mail cannot be found in database
                } else {
                    // If e-mail found in database, create e-mail object
                    var email = {
                        from: 'Localhost Staff, cruiserweights@zoho.com',
                        to: user.email,
                        subject: 'Localhost Username Request',
                        text: 'Hello ' + user.name + ', You recently requested your username. Please save it in your files: ' + user.username,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested your username. Please save it in your files: ' + user.username
                    };

                    // Function to send e-mail to user
                    client.sendMail(email, function(err, info) {
                        if (err) {
                            console.log(err); // If error in sending e-mail, log to console/terminal
                        } else {
                            console.log(info); // Log confirmation to console
                        }
                    });
                    res.json({ success: true, message: 'Username has been sent to e-mail! ' }); // Return success message once e-mail has been sent
                }
            }
        });
    });

    // Route to send reset link to the user
    router.put('/resetpassword', function(req, res) {
        User.findOne({ username: req.body.username }).select('username active email resettoken name').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                    to: 'gugui3z24@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Username was not found' }); // Return error if username is not found in database
                } else if (!user.active) {
                    res.json({ success: false, message: 'Account has not yet been activated' }); // Return error if account is not yet activated
                } else {
                    user.resettoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
                    // Save token to user in database
                    user.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: err }); // Return error if cannot connect
                        } else {
                            // Create e-mail object to send to user
                            var email = {
                                from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                to: user.email,
                                subject: 'Reset Password Request',
                                text: 'Hello ' + user.name + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://www.herokutestapp3z24.com/reset/' + user.resettoken,
                                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://www.herokutestapp3z24.com/reset/' + user.resettoken + '">http://www.herokutestapp3z24.com/reset/</a>'
                            };
                            // Function to send e-mail to the user
                            client.sendMail(email, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console
                                    console.log('sent to: ' + user.email); // Log e-mail 
                                }
                            });
                            res.json({ success: true, message: 'Please check your e-mail for password reset link' }); // Return success message
                        }
                    });
                }
            }
        });
    });

    // Route to verify user's e-mail activation link
    router.get('/resetpassword/:token', function(req, res) {
        User.findOne({ resettoken: req.params.token }).select().exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                    to: 'gugui3z24@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                var token = req.params.token; // Save user's token from parameters to variable
                // Function to verify token
                jwt.verify(token, secret, function(err, decoded) {
                    if (err) {
                        res.json({ success: false, message: 'Password link has expired' }); // Token has expired or is invalid
                    } else {
                        if (!user) {
                            res.json({ success: false, message: 'Password link has expired' }); // Token is valid but not no user has that token anymore
                        } else {
                            res.json({ success: true, user: user }); // Return user object to controller
                        }
                    }
                });
            }
        });
    });

    // Save user's new password to database
    router.put('/savepassword', function(req, res) {
        User.findOne({ username: req.body.username }).select('username email name password resettoken').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                    to: 'gugui3z24@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                if (req.body.password === null || req.body.password === '') {
                    res.json({ success: false, message: 'Password not provided' });
                } else {
                    user.password = req.body.password; // Save user's new password to the user object
                    user.resettoken = false; // Clear user's resettoken 
                    // Save user's new data
                    user.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            // Create e-mail object to send to user
                            var email = {
                                from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                to: user.email,
                                subject: 'Password Recently Reset',
                                text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at localhost.com',
                                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at localhost.com'
                            };
                            // Function to send e-mail to the user
                            client.sendMail(email, function(err, info) {
                                if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                            });
                            res.json({ success: true, message: 'Password has been reset!' }); // Return success message
                        }
                    });
                }
            }
        });
    });

    

    // Route to get the currently logged in user    
    router.post('/me', function(req, res) {
        res.send(req.decoded); // Return the token acquired from middleware
    });

    // Route to provide the user with a new token to renew session
    router.get('/renewToken/:username', function(req, res) {
        User.findOne({ username: req.params.username }).select('username email').exec(function(err, user) {
            if (err) {
             
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                // Check if username was found in database
                if (!user) {
                    res.json({ success: false, message: 'No user was found' }); // Return error
                } else {
                    var newToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Give user a new token
                    res.json({ success: true, token: newToken }); // Return newToken in JSON object to controller
                }
            }
        });
    });

    // Route to get the current user's permission level
    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user) {
            if (err) {
               
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                // Check if username was found in database
                if (!user) {
                    res.json({ success: false, message: 'No user was found' }); // Return an error
                } else {
                    res.json({ success: true, permission: user.permission }); // Return the user's permission
                }
            }
        });
    });

    // Route to get all users for management page
    router.get('/management', function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
           
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                    if (err) {
                        // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                        var email = {
                            from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                            to: 'gugui3z24@gmail.com',
                            subject: 'Error Logged',
                            text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                            html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                        };
                        // Function to send e-mail to myself
                        client.sendMail(email, function(err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });
                        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                    } else {
                        // Check if logged in user was found in database
                        if (!mainUser) {
                            res.json({ success: false, message: 'No user found' }); // Return error
                        } else {
                            // Check if user has editing/deleting privileges 
                            if (mainUser.permission === 'admin' || mainUser.permission === 'client') {
                                // Check if users were retrieved from database
                                if (!users) {
                                    res.json({ success: false, message: 'Users not found' }); // Return error
                                } else {
                                    res.json({ success: true, users: users, permission: mainUser.permission }); // Return users, along with current user's permission
                                }
                            } else {
                                res.json({ success: false, message: 'Insufficient Permissions' }); // Return access error
                            }
                        }
                    }
                });
            }
        });
    });
 // Route to get all users for management page
    router.get('/managemente', function(req, res) {
        Chaine.find({}, function(err, chaines) {
          if (!chaines) {
                                    res.json({ success: false, message: 'Users not found' }); // Return error
                                } else {
                                    res.json({ success: true, chaines: chaines}); // Return users, along with current user's permission
                                }
            
        });
    
    });

    router.get('/managementabonnement', function(req, res) {
        Abonnement.find({}, function(err, abonnements) {
          if (!abonnements) {
                                    res.json({ success: false, message: 'Abonnement not found' }); // Return error
                                } else {
                                    res.json({ success: true, abonnements:abonnements}); // Return users, along with current user's permission
                                }
            
        });
    
    });



    // Route to delete a user
    router.delete('/management/:username', function(req, res) {
        var deletedUser = req.params.username; // Assign the username from request parameters to a variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) {
                
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                // Check if current user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); // Return error
                } else {
                    // Check if curent user has admin access
                    if (mainUser.permission !== 'admin') {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    } else {
                        // Fine the user that needs to be deleted
                        User.findOneAndRemove({ username: deletedUser }, function(err, user) {
                            if (err) {
                                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                var email = {
                                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                    to: 'gugui3z24@gmail.com',
                                    subject: 'Error Logged',
                                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                };
                                // Function to send e-mail to myself
                                client.sendMail(email, function(err, info) {
                                    if (err) {
                                        console.log(err); // If error with sending e-mail, log to console/terminal
                                    } else {
                                        console.log(info); // Log success message to console if sent
                                        console.log(user.email); // Display e-mail that it was sent to
                                    }
                                });
                                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                            } else {
                                res.json({ success: true }); // Return success status
                            }
                        });
                    }
                }
            }
        });
    });

    // Route to get the user that needs to be edited
    router.get('/edit/:id', function(req, res) {
        var editUser = req.params.id; // Assign the _id from parameters to variable
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) {
             
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                // Check if logged in user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); // Return error
                } else {
                    // Check if logged in user has editing privileges
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Find the user to be editted
                        User.findOne({ _id: editUser }, function(err, user) {
                            if (err) {
                                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                var email = {
                                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                    to: 'gugui3z24@gmail.com',
                                    subject: 'Error Logged',
                                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                };
                                // Function to send e-mail to myself
                                client.sendMail(email, function(err, info) {
                                    if (err) {
                                        console.log(err); // If error with sending e-mail, log to console/terminal
                                    } else {
                                        console.log(info); // Log success message to console if sent
                                        console.log(user.email); // Display e-mail that it was sent to
                                    }
                                });
                                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                            } else {
                                // Check if user to edit is in database
                                if (!user) {
                                    res.json({ success: false, message: 'No user found' }); // Return error
                                } else {
                                    res.json({ success: true, user: user }); // Return the user to be editted
                                }
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                    }
                }
            }
        });
    });

    // Route to update/edit a user
    router.put('/edit', function(req, res) {
        var editUser = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.name) var newName = req.body.name; // Check if a change to name was requested
        if (req.body.username) var newUsername = req.body.username; // Check if a change to username was requested
        if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
        if (req.body.permission) var newPermission = req.body.permission; // Check if a change to permission was requested
        // Look for logged in user in database to check if have appropriate access
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) {
               
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                // Check if logged in user is found in database
                if (!mainUser) {
                    res.json({ success: false, message: "no user found" }); // Return error
                } else {
                    // Check if a change to name was requested
                    if (newName) {
                        // Check if person making changes has appropriate access
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            // Look for user in database
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                    var email = {
                                        from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                        to: 'gugui3z24@gmail.com',
                                        subject: 'Error Logged',
                                        text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                        html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                    };
                                    // Function to send e-mail to myself
                                    client.sendMail(email, function(err, info) {
                                        if (err) {
                                            console.log(err); // If error with sending e-mail, log to console/terminal
                                        } else {
                                            console.log(info); // Log success message to console if sent
                                            console.log(user.email); // Display e-mail that it was sent to
                                        }
                                    });
                                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        user.name = newName; // Assign new name to user in database
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log any errors to the console
                                            } else {
                                                res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }

                    // Check if a change to username was requested
                    if (newUsername) {
                        // Check if person making changes has appropriate access
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            // Look for user in database
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                   
                                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        user.username = newUsername; // Save new username to user in database
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'Username has been updated' }); // Return success
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }

                    // Check if change to e-mail was requested
                    if (newEmail) {
                        // Check if person making changes has appropriate access
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            // Look for user that needs to be editted
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                    // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                                    var email = {
                                        from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                        to: 'gugui3z24@gmail.com',
                                        subject: 'Error Logged',
                                        text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                                        html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                                    };
                                    // Function to send e-mail to myself
                                    client.sendMail(email, function(err, info) {
                                        if (err) {
                                            console.log(err); // If error with sending e-mail, log to console/terminal
                                        } else {
                                            console.log(info); // Log success message to console if sent
                                            console.log(user.email); // Display e-mail that it was sent to
                                        }
                                    });
                                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                } else {
                                    // Check if logged in user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        user.email = newEmail; // Assign new e-mail to user in databse
                                        // Save changes
                                        user.save(function(err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'E-mail has been updated' }); // Return success
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }

                    // Check if a change to permission was requested
                    if (newPermission) {
                        // Check if user making changes has appropriate access
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            // Look for user to edit in database
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                    
                                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                } else {
                                    // Check if user is found in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        // Check if attempting to set the 'user' permission
                                        if (newPermission === 'user') {
                                            // Check the current permission is an admin
                                            if (user.permission === 'admin') {
                                                // Check if user making changes has access
                                                if (mainUser.permission !== 'admin') {
                                                    res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade an admin.' }); // Return error
                                                } else {
                                                    user.permission = newPermission; // Assign new permission to user
                                                    // Save changes
                                                    user.save(function(err) {
                                                        if (err) {
                                                            console.log(err); // Long error to console
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                        }
                                                    });
                                                }
                                            } else {
                                                user.permission = newPermission; // Assign new permission to user
                                                // Save changes
                                                user.save(function(err) {
                                                    if (err) {
                                                        console.log(err); // Log error to console
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                    }
                                                });
                                            }
                                        }
                                        // Check if attempting to set the 'moderator' permission
                                        if (newPermission === 'moderator') {
                                            // Check if the current permission is 'admin'
                                            if (user.permission === 'admin') {
                                                // Check if user making changes has access
                                                if (mainUser.permission !== 'admin') {
                                                    res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' }); // Return error
                                                } else {
                                                    user.permission = newPermission; // Assign new permission
                                                    // Save changes
                                                    user.save(function(err) {
                                                        if (err) {
                                                            console.log(err); // Log error to console
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                        }
                                                    });
                                                }
                                            } else {
                                                user.permission = newPermission; // Assign new permssion
                                                // Save changes
                                                user.save(function(err) {
                                                    if (err) {
                                                        console.log(err); // Log error to console
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                    }
                                                });
                                            }
                                        }

                                        // Check if assigning the 'admin' permission
                                        if (newPermission === 'admin') {
                                            // Check if logged in user has access
                                            if (mainUser.permission === 'admin') {
                                                user.permission = newPermission; // Assign new permission
                                                // Save changes
                                                user.save(function(err) {
                                                    if (err) {
                                                        console.log(err); // Log error to console
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                    }
                                                });
                                            } else {
                                                res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level' }); // Return error
                                            }
                                        }
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }
                }
            }
        });
    });

    //// go routes 
    router.get('/go/bouquets/:_bouq',function(req,res){
        var b = req.params._bouq;
        b=b.replace(/ /g, "%20");  
        var t ="";
        if (Token==""){
            t=Tokenrecepteur;
        }else{
            t=Token;
        }
        var options = {
            host: 'localhost',
            port: 8000 ,
            path: '/admin/main/bouquets?bouq='+b,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 
                    'Bearer '+t
                }      
        };
        
        getJSONBouq(options, function(err,result){
      
            if(err){
                res.sendStatus(403);
                return console.log('error while trying to get call go: ',err);
            }
            res.json(result );
            
       })
        
       
    });
    
    router.get('/go/now/:_bouqq/:_chaine',function(req,res){
        var b = req.params._bouqq;
        var c = req.params._chaine;
        b=b.replace(/ /g, "%20");  
        c=c.replace(/ /g, "%20");  
        var t ="";
        if (Token==""){
            t=Tokenrecepteur;
        }else{
            t=Token;
        }
        var options = {
            host: 'localhost',
            port: 8000 ,
            path: '/admin/main/now?bouq='+b+'&channel='+c,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 
                    'Bearer '+t
                }      
        };
            getJSONBouq(options, function(err,result){
            if(err){
                res.sendStatus(403);
                return console.log('error while trying to get call go: ',err);
            }
            res.json( result );
            })    
    }); 


    router.post('/history', function(req,res){
        var datetime = new Date();
        var channel = req.body;
        var channel_name = channel.nom_chaine;
        var recepteur = channel.recepteur;
        var program ="";
        console.log(channel);
        var data = {recepteur:recepteur,
            bouquet:"",
            channel:channel_name,
            program:"",
            date:datetime
        };
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
        
            dbo.collection("channel").find({name:channel_name}).toArray(function(err, resl) {
            if (err) throw err;
            dbtab= resl;
            if (resl[0]){
                console.log(resl[0].current_program);

                data = {recepteur:recepteur,
                    bouquet:resl[0].bouquet,
                    channel:channel_name,
                    program:resl[0].current_program,
                    date:datetime
                };
                console.log(data);
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("testhoussem");
                
                    dbo.collection("history").insertOne(data, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    
                    db.close();
                    });
                }); 

                res.json(data)
            }
            db.close();
            });
        }); 

        var arr = [ 'frensh', 'tunisia'];
        var bouq ="";
        
        arr.forEach(function(b) {
        
            b=b.replace(/ /g, "%20");  
            c=channel_name.replace(/ /g, "%20");  
            var t ="";
            if (Token==""){
                t=Tokenrecepteur;
            }else{
                t=Token;
            }
            var options = {
                host: 'localhost',
                port: 8000 ,
                path: '/admin/main/now?bouq='+b+'&channel='+c,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 
                        'Bearer '+t
                    }      
            };
                getJSONBouq(options, function(err,result){
                if(err){
                    res.sendStatus(403);
                    return console.log('error while trying to get call go: ',err);
                }
                //var resu = json.parse(result);
                //console.log(json.stringify(result));
                var resu = json.parse(json.stringify(result));
                var resu1 = (resu.message);
                var resu2 = (resu.Program);
                console.log(resu.message);
                console.log(resu.Program);
                if (resu1 =='missing or malformed jwt')
                    return console.log('error while trying to get call go: ',err);
                    
                    if (resu2 !=''){
                        //console.log("hi2");
                        bouq =b;
                        program = resu.Program;
                        
                        data = {recepteur:recepteur,
                            bouquet:b,
                            channel:channel_name,
                            program:program,
                            date:datetime
                        };
                        console.log(data);
                        MongoClient.connect(url, function(err, db) {
                            if (err) throw err;
                            var dbo = db.db("testhoussem");
                        
                            dbo.collection("history").insertOne(data, function(err, res) {
                            if (err) throw err;
                            console.log("1 document inserted");
                            
                            db.close();
                            });
                        }); 
                            
                        res.json(data)
                        return console.log('channel found in go : ', channel_name);
                        
                    }
                

                })  
          
        });
        
    });
    


    router.get('/historys', function(req,res){
        
       
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("history").find({}).toArray( function(err, result) {
              if (err) throw err;
              //var jsonString = JSON.stringify(result[0]);
              res.json(result);
              db.close();
            });
          });
        
    
    });

    router.get('/watcherchannel/:_chaine', function(req,res){
        
        var c = req.params._chaine;
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("history").find({channel:c}).count(function(err, resl) {
                if (err) throw err;
              //var jsonString = JSON.stringify(result[0]);
                res.json(resl);
                db.close();
            });
          });
        
    
    });

    router.get('/programs/:_chaine', function(req,res){
        
        var c = req.params._chaine;
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("history").find({channel:c}).toArray(function(err, resl) {
                if (err) throw err;
              //var jsonString = JSON.stringify(result[0]);
             // console.log(resl);
                res.json(resl);
                db.close();
            });
          });
        
    
    });

    router.get('/watcherprogram/:_chaine/:_prog', function(req,res){
        
        var p = req.params._prog;
        var c = req.params._chaine;
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("history").find({channel:c,program:p}).count(function(err, resl) {
                if (err) throw err;
              //var jsonString = JSON.stringify(result[0]);
              res.json(resl);
              db.close();
            });
          });
        
    
    });

    router.get('/receiversregion/:_cl/:_region', function(req,res){
        
      
        var c = req.params._cl;
        var r = req.params._region;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("recepteurs").find({client:c,region:r}).toArray(function(err, resl) {
                if (err) throw err;
              //var jsonString = JSON.stringify(result[0]);
              res.json(resl);
              db.close();
            });
          });
        
    
    });

    router.get('/receiversfamsize/:_cl/:_size', function(req,res){
        
      
        var c = req.params._cl;
        var s = req.params._size;

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("recepteurs").find({client:c,fam_size:s}).toArray(function(err, resl) {
                if (err) throw err;
              //var jsonString = JSON.stringify(result[0]);
              res.json(resl);
              db.close();
            });
          });
        
    
    });

    router.get('/receivers/:_cl', function(req,res){
        
      
        var c = req.params._cl;

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("recepteurs").find({client:c}).toArray(function(err, resl) {
                if (err) throw err;
              //var jsonString = JSON.stringify(result[0]);
              res.json(resl);
              db.close();
            });
          });
        
    
    });

    router.get('/receiversage/:_cl/:_age', function(req,res){
        
      
        var c = req.params._cl;
        var a = req.params._age;

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("testhoussem");
            dbo.collection("recepteurs").find({client:c,fam_age:a}).toArray(function(err, resl) {
                if (err) throw err;
              //var jsonString = JSON.stringify(result[0]);
              res.json(resl);
              db.close();
            });
          });
        
    
    });
    return router; // Return the router object to server
};
