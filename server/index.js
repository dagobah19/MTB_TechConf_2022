const url = require('url');
var express = require('express');
var cors = require('cors')
var app = express();
const bodyParser = require('body-parser');
const { Client } = require('cassandra-driver');
var cassandra = require('cassandra-driver'); 
var auth = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
var contactPoints = ['localhost'];
const port=3001

//allow CORS for all requests
app.use(cors()) 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var client = new cassandra.Client({contactPoints: contactPoints, 
    localDataCenter: 'datacenter1', 
    authProvider: auth, keyspace:'sensordata'
});

app.get('/', function (req, res) {
    res.send('Not implemented');
});

app.post('/sensordata/:sensor', function(req,res){
    var sensorName=req.params.sensor;
    var timestamp = req.body.timestamp;
    var data=(JSON.stringify(req.body.data)).replace(/\"/g, '\'');
    if (timestamp){
        //var datetime = DateTime.UtcNow.ToString("yyyy-MM-dd HH:MM:ss");
    } else {
        var query = "INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('"+sensorName+"',toTimeStamp(now()),"+data+")"
    }
    client.execute(query,function(err,result){
        if (err) {
            console.log(err)
            res.json({"result":"error"});
        } else {
            res.json({"result":"success"});
        }
    });
})

app.get('/sensordata/:sensor', function(req,res) {
    const queryObj = url.parse(req.url, true).query;
    var limit=1000
    if (queryObj.limit && !isNaN(queryObj.limit) && queryObj.limit>0) {limit=queryObj.limit}
    var returnedData=[];
    var sensorName=req.params.sensor;
    var query = "SELECT entry_date,data from unstructured_sensordata WHERE sensor_name = ? LIMIT "+limit;
    client.stream(query,[sensorName])
        .on('readable', function(){
            var row;
            while (row=this.read()){
                returnedData.push({"timestamp":row.entry_date,"data":row.data})
            }
        })
        .on('end', function () {
            // Stream ended, there aren't any more rows
            res.json(returnedData);
          })
          .on('error', function (err) {
            // Something went wrong: err is a response error from Cassandra
            res.json();
          });

});

app.use(function(req, res, next) {
    res.status(404).send("Not Found");
});

// start server on port
app.listen(port, function () {
    console.log('Server app listening on port ' + port);
});