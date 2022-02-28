# Sensor Sample Code

## bulk-upload.py

Sometimes its more efficient to 'save' a lot of data and bulk load it. To do this, we can use a temporary file or database locally to store the data and send the data to the webservice periodically, say, every minute. This comes in handy if the IoT sensor collects a lot of data in a short time.

While we could technically put both the periodic upload and sensor data collection in one script, we are keeping them separate for performance reasons. This way, if we get hung in the upload, the upload takes more than a second, or if we want to collect data more than several times per second, we can do so in parallel. 

For this implementation we are going to use flat files.

To get started, edit the svcURL variable in the script to wherever the service is exposed that will collect the data. Then add this line to crontab using sudo crontab -e:

    * * * * * python /home/pi/IoT/bulk-upload.py

This will run the job every minute. To send every 3 minutes, as an example, use this:

    */3 * * * * python /home/pi/IoT/bulk-upload.py

## simple-upload-single-reading-sample.py

As the name implies, this is an example of gathering a single sensor reading then sending it to a webservice. This is well suited for a sensor that occasionally sends data, such as when on a specific occurrence such as motion detected, or when when temp reaches a threshold, etc. 
