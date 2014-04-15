// root directory

var _root = '~/public_html/355L16/NEWL16';
// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
    connect    = require('connect');

// Application initialization

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'swalker',
        password : '3453273'
    });
    
//var app = module.exports = express.createServer();
var app = express();

// Database setup
//connection.query('DROP DATABASE IF EXISTS test', function(err) {
//	if (err) throw err;
	connection.query('CREATE DATABASE IF NOT EXISTS swalker', function (err) {
	    if (err) throw err;
	    connection.query('USE swalker', function (err) {
	        if (err) throw err;
        	connection.query('CREATE TABLE IF NOT EXISTS p2_projects('
	            + 'PID INT PRIMARY KEY AUTO_INCREMENT,'
                + 'Name VARCHAR(100) NOT NULL,'
                + 'creatorID int,'
                + 'creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'
                + 'foreign key (creatorID) references p2_user(UID)'
	            +  ')', function (err) {
        	        if (err) throw err;
	            });
	    });
	});
//});

// Configuration

app.use(connect.bodyParser());
app.use(express.static(__dirname + '/public'));

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/projects', function(req, res) {
    res.sendfile(__dirname + '/projects.html');
});

app.get('/projects/createproject', function(req, res) {
  res.sendfile(__dirname + '/createproject.html');
});

app.get('/projects/getproject', function(req, res) {
  res.sendfile(__dirname + '/getproject.html');
});

app.get('/login', function(req, res) {
    res.sendfile(__dirname + '/login.html')
});

app.get('/settings', function(req, res) {
    res.sendfile(__dirname + '/settings.html');
});

app.get('/teams', function(req, res) {
    res.sendfile(__dirname + '/teams.html');
});

app.get('/help', function(req, res) {
    res.sendfile(__dirname + '/help.html');
});

app.get('/projectdetails', function(req, res){
    res.sendfile(__dirname + '/projectdetails.html')
});

// Update MySQL database

var output = '';

app.post('/getproject', function (req, res) {
    output = '';
    console.log(req.body);
            connection.query("select p.Name from p2_projects p join p2_user u on p.creatorID=u.UID where u.Name= ?", req.body.username, 
		function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                        output = '<table><tr><th>Project</th></tr>'
                        for (var i = 0; i < result.length; i++)
                        {
                            output = output + '<tr>' + '<td>' + '<a href="/projectdetails/">' + result[i].Name + '</a>' + '</td>' + '</tr>';
                        }
                        output = output + '</table>'
  	                    res.send(output);
                    }
                    else
                      res.send('Project does not exist.');
		});
});

app.post('/createproject', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO p2_projects SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            connection.query('select Name from p2_project where Name = ?', req.body.username, 
		function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
  	              res.send('username: ' + result[0].username);
                    }
                    else
                      res.send('Project was not inserted.');
		});
    });
});

app.post('/projectdetails/select', function (req, res) {
    console.log(req.body);
    connection.query('select * from p2_projects', function(err, result) {
            console.log(result);
            var responseHTML = '<select id="proj-list">';
            for (var i = 0; result.length > i; i++) {
                var option = '<option value="' + result[i].PID + '">' + result[i].Name + '</option>';
                console.log(option);
                responseHTML += option;
            }
            responseHTML += '</select>';
            res.send(responseHTML);
    });
});

// Begin listening

app.listen(8027);
console.log("Express server listening on port %d in %s mode", app.settings.env);
