CREATE KEYSPACE sensordata WITH replication =  {'class':'SimpleStrategy', 'replication_factor':1};​

USE sensordata;​

CREATE COLUMNFAMILY sensordata(​
sensor_name text,​
entry_date timestamp,​
motion Boolean,​
primary key (sensor_name,entry_date));​
​

CREATE TABLE unstructured_sensordata(
    "sensor_name" text,
    "entry_date" timestamp,
    "data" map<text, text>,
    primary key (sensor_name,entry_date)
) WITH CLUSTERING ORDER BY (entry_date DESC);

/* list */

CREATE TABLE unstructured_sensordata_list(
    "sensor_name" text,
    "entry_date" timestamp,
    "data" list<frozen<map<text, text>>>,
    primary key (sensor_name,entry_date)
) WITH CLUSTERING ORDER BY (entry_date DESC);