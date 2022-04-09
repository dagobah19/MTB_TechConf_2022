/*
* First we define variables and require for the express api server to work
*/

const url = require('url');
var express = require('express');
var cors = require('cors')
var app = express();
const bodyParser = require('body-parser');

//allow CORS for all requests
app.use(cors()) 
//use json as our body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
* Next we define our database variables, Cassandra
*/

const { Client } = require('cassandra-driver');
var cassandra = require('cassandra-driver'); 
var auth = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
var contactPoints = ['localhost'];

/*
* Miscellanous imports we need
*/

var moment = require('moment');
const { timeStamp } = require('console');

/*
* Define the ports we will listen on
*/

const serverPort=3005
const socketPort=3006

/*
* START connections & servers
*/

//Cassandra

var client = new cassandra.Client({contactPoints: contactPoints, 
    localDataCenter: 'datacenter1', 
    authProvider: auth, keyspace:'sensordata'
});

//Websocket

const webSocketServer = require('websocket').server;
const http = require('http');
const server = http.createServer();
server.listen(socketPort, function(){
    console.log("listening to socket server on %d",socketPort)
});

const wsServer = new webSocketServer({
    httpServer: server
});

//http express server
app.listen(serverPort, function () {
    console.log('Server app listening on port %d',serverPort);
});
  
/*
* WEBSOCKET listeners
*/

//this object will hold our clients connection information
const clients = {};

//generate a unique client id for incoming requests / connections
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + s4();
};

//send data to all connected clients
const sendMessage = (message) => {
    //console.log(JSON.stringify(message))
    Object.keys(clients).map((client) => {
      clients[client].send(message);
    });
}

wsServer.on('request', function(request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Received new connection from origin ' + request.origin + '.');
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

    connection.on('message', function(message) {
        //sendMessage(JSON.stringify({"message":message}))
        console.log(message);
        sendMessage(message)
    });
    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + userID + " disconnected.");
        delete clients[userID];
        sendMessage(userID + " disconnected.");
    });
});

/*
* HTTP LISTENERS
*/

/*  
*   Define an action and return for the root
*   We will just return a simple message if someone accesses
*   the / (get)
*/
app.get('/', function (req, res) {
    res.send('Not implemented');
    //res.sendStatus(200)
});

/*  
*   method to POST and save sensor data for ANY sensor name
*   pass the sensor name in the :sensor
*   Example: /sensordata/MySensorName
*   Data is in the posted data JSON object called "data", it can contain as many datapoints as needed, however, 
*   it cannot contain an array []
*   Everything must be a string, so numbers should be enclosed in quotes
*   Valid: {"data":{'temp':'27','motion':'false','variance':'9'}}
*   Invalid: {"data":[{'temp1':25},{'temp2':88}]}
*   (Even though the last example was valid JSON, it cannot be saved into the same database columnfamily)
*
*   Returns: JSON result of success or failure
*/
app.post('/sensordata/:sensor', function(req,res){
    var sensorName=req.params.sensor;
    var timestamp = req.body.timestamp;
    var data=(JSON.stringify(req.body.data)).replace(/\"/g, '\'');
    var sensorquery = "INSERT INTO sensors (sensor_name) VALUES ('"+sensorName+"')"
    client.execute(sensorquery,function(err,result){
        if (err){
            console.log("SENSOR insert error: "+err)
        }
    })
    if (timestamp){
        console.log(timestamp)
        //var datetime = DateTime.UtcNow.ToString("yyyy-MM-dd HH:MM:ss");
        var momentDate = moment(timestamp).format("YYYY-MM-DD HH:MM:ss.SSSSSS");
        var query = "INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('"+sensorName+"','"+momentDate+"',"+data+")"
    } else {
        var query = "INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('"+sensorName+"',toTimeStamp(now()),"+data+")"
    }
    client.execute(query,function(err,result){
        if (err) {
            console.log(err)
            res.json({"result":"error"});
        } else {
            res.json({"result":"success"});
            getSensorData(sensorName)
        }
    });
})

/*  
*   GET all the data for :sensor
*   By default, will limit to last 1000 results
*   You can override this by passing the limit querystring
*   Note that with cassandra you cannot 'sort' or 'order' data, this is 
*   done at the database level using clustering 
*   Example: /sensordata/MySensorName?limit=20
*/

app.get('/sensordata/:sensor', function(req,res) {
    var limit=1000
    const queryObj = url.parse(req.url, true).query;
    if (queryObj.limit && !isNaN(queryObj.limit) && queryObj.limit>0) {limit=queryObj.limit}
    getSensorData(req.params.sensor,limit,res)
});


/*  
*   Define a 404 error message & route to catch the rest of possible queries
*   we do this so express will not "hang" when it comes across an unknown route
*/

app.use(function(req, res, next) {
    res.status(404).send("Not Found");
});

/*
*   Function to get sensor data for an individual sensor
*   If res is passed, a response is assumed and sent from the res based on the query
*   If res is ommitted, the data will be passed to sendMessage() which will broadcast to the connected socket clients
*/

function getSensorData(sensor,limit,res){
    if (!limit) limit=5;
    var returnedData=[];
    var query = "SELECT entry_date,data from unstructured_sensordata WHERE sensor_name = ? LIMIT "+limit;
    client.stream(query,[sensor])
        .on('readable', function(){
            var row;
            while (row=this.read()){
                returnedData.push({"timestamp":row.entry_date,"data":row.data})
            }
        })
        .on('end', function () {
            // Stream ended, there aren't any more rows
            res?res.json({"sensor":sensor,"data":returnedData}):sendMessage({"sensor":sensor,"data":returnedData});
            return true;
          })
          .on('error', function (err) {
            // Something went wrong: err is a response error from Cassandra
            res?res.json():false;
            return false;
          });
}