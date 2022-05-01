# Sensor Samples & Code

There are several ready to use (out of the box) sensor sample codes to use and base your sensor project on. Each one can send data to the server so it is displayed on the webconsole.

## Sensors

### blink.py

Two LEDs are wired up along with a switch. Turn the switch on, and the LEDs blink or alternate according to a duration that is set. When the switch is on, the server is sent a message that blink is on. Turn the switch off, the LEDs turn off and the server is sent a message that blink is off. The fuzz is coming for you.

### climate.py

A temperature/humidity sensor is connected, and readings are attempted every few seconds (configurable in the script). The sensor is a little temperamental and error prone, so a try catch exception is built in to continue if no reading is returned. The values are sent to the server module.

### distance.py

An analog Sharp IR distance sensor is connected to the RPi using an MCP3008 converter chip, to convert the signal to digital, and set to send the distance detected to the server module in a configurable interval. 

### motion.py

When switched on, if motion is detected an LED will illuminate and will send a message to the server module. When motion is not detected it will send another message that motion is no longer detected.

### sound.py

A simple sound sensor is connected, and if sound is detected, it will send a message to the server. On the flip side, when there is no sound detected, it will send a message that no sound is being detected.

### template.py

This is a simple RPi GPIO template that contains simple template logic for building your own sensor/module.

## Some ideas for improvements / adding to the sensors

You may choose to extend or build upon the existing sensors. Here are a few ideas.

- Add an LED (with a resistor of course) to a sensor module that does not have one and tie it to an event, such as data being changed or detected
- Add logic to the motion.py that only sends data if it changed (motion -> no motion, or vice versa)

# Sending data to the server module

At the moment, all the servers are set to send a message to the server module as soon as it occurs. The functionality is provided using the python requests module, which is implemented in each script. 

## bulk-upload.py

Sometimes its more efficient to 'save' a lot of data and bulk load it. To do this, we can use a temporary file or database locally to store the data and send the data to the webservice periodically, say, every minute. This comes in handy if the IoT sensor collects a lot of data in a short time.

While we could technically put both the periodic upload and sensor data collection in one script, we are keeping them separate for performance reasons. This way, if we get hung in the upload, the upload takes more than a second, or if we want to collect data more than several times per second, we can do so in parallel. 

For this implementation we are going to use flat files.

To get started, edit the svcURL variable in the script to wherever the service is exposed that will collect the data. Then add this line to crontab using sudo crontab -e:

    * * * * * python /home/pi/IoT/bulk-upload.py

This will run the job every minute. To send every 3 minutes, as an example, use this:

    */3 * * * * python /home/pi/IoT/bulk-upload.py


