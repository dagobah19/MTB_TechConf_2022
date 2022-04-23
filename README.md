# Setup

1. Install the database
2. Run npm install
3. Run npm install in the server/ folder
4. Run npm install in the webconsole/ folder

## Installing the database

1. Run `sudo apt update` to update the repos
2. Install java: `sudo apt install openjdk-8-jdk -y`
3. Check the java version: `java -version`
4. Install apt-transport-https: `sudo apt install apt-transport-http`
5. Add the repo: 
`sudo sh -c 'echo "deb http://www.apache.org/dist/cassandra/debian 40x main" > /etc/apt/sources.list.d/cassandra.list'`
6. Import thge GPG key:
`wget -q -O - https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -`
7. Update the repo again: `sudo apt update`
8. Install Cassandra: `sudo apt install Cassandra`
9. Verify Cassandra is running.
Using nodetool:
`nodetool status`
Using systemctl:
`sudo systemctl status cassandra`
10. Set Cassandra to start automatically on boot:
`sudo systemctl enable cassandra`
11. Create the database by entering the csqlsh:
`cqlsh -f database\create.cql`
You can also manually create the database by entering the cqlsh and typing in the table create statements

## Starting the servers

We can run the webconsole and server in development mode concurrently using this command from the main directory:
`npm run start`

We can also run each individually:
### Server
`cd server`
`node index.js`

### Webconsole
`cd webconsole`
`npm start`

## Deploying webconsole
You may also compile / optimize the webconsole and deploy to nginx/apache:
- `npm run build`
- `cp dist/. /path/to/html`

# Sensors
There are 5 sensors currently configured, plus a template:
- blink
- climate
- distance
- motion
- sound
- template

## Running
To run the sensor code on the sensors, simply run `python3 <sensorname>.py`

## Configuration
Once the hardware is built, the sensors are ready to run immediately. A couple of things to check before running:

- Check that the sensor_name variable is correct
- Check the IoT url variable is set correctly

## Making Changes
If you rewire hardware, add or remove sensors, etc, make sure the code is updated. 
You can make a copy of the code by entering the command `cp <sensor>.py <newfile>.py`

Use nano to edit the file `nano <sensor>.py`

If you change the name of the sensor, you will need to add it to the webconsole manually to get it to report correctly

The server is setup to accept and store any sensor name and data you send

# Stopping the servers
Press `CTRL-C` to terminate the server processes.

If you started the servers individually, press `CTRL-C` in each command line that was opened