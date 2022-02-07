/* DEMO Data */

INSERT INTO sensordata (sensor_name,entry_date,motion) VALUES ('demosensor',toTimeStamp(now()),false);
INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('demosensor',toTimeStamp(now()),{'reading1':'100','motion':'false','variance':'9'});
INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('demosensor55',toTimeStamp(now()),{'test1':'17','active':'true','myname':'david','fruit':'peaches'});
INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('daemon4',toTimeStamp(now()),{'ask':'no'});
INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('daemon8',toTimeStamp(now()),[{'item':'1'},{'item':'2'}]);
INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('daemon4',toTimeStamp(now()),{"ask":"yes"});
INSERT INTO unstructured_sensordata (sensor_name,entry_date,data) VALUES ('mySensorNameTEST',toTimeStamp(now()),{'value1':'test1','value2':'test2'})
