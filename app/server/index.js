


/*
Load all models here
*/
let express = require('express'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	cors = require('cors'),
	app = express(),
	path = require('path'),
	router = express.Router();
	mongoose = require('mongoose');
    expressValidator = require('express-validator');
 passport = require('passport');

let connect = function() {
	var options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	};
	//
	if(process.env.NODE_ENV === 'test'){
		mongoose.connect("mongodb://localhost/myusers", options);	
	} else{
		mongoose.connect("mongodb://dbuser:dbpassword@ds119018.mlab.com:19018/socialnetwork", options);
	}
	
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
mongoose.set('debug', true);

fs.readdirSync(__dirname + '/model').forEach(function(file) {
	if (~file.indexOf('.js')) require(__dirname + '/model/' + file);
});

// Bootstrap passport config
require('./passport')(passport);

  // Middleware.
app.use(require('morgan')('combined'));

app.use(require('compression')());

app.use(express.static('./app/static'));

//Load cookie parser
app.use(cookieParser());

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//parse application/json
app.use(bodyParser.json())


//Load HTTP access control(CROS)
app.use(cors());



/*************************************************
Reads controller directory and requires all files
**************************************************/
fs.readdirSync(__dirname+"/controllers").forEach(function(filename) {

	if(filename!='uploads'&&filename.indexOf('.js')) {
					console.log("filename",filename)

		require("./controllers/"+filename)(router);
	}
});
/**********************************************************
Reads controller directory and requires all files ends here
***********************************************************/
app.use(expressValidator());


//uses router module
app.use("/api",router);

//client routing, enables to refresh ui page
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'static', 'index.html'));
});

//server connects to localhost at port 3000
let server=app.listen((process.env.PORT || 8000), function () {
  console.log("Server connect at port:8000")
});
