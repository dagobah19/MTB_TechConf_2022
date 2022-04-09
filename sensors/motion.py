# This is a basic motion detector, designed to turn on an LED connected to GPIO 11 on the RPi when motion is detected,
# and turning off when there is no motion

import RPi.GPIO as GPIO
import time
import sendData

# Sensor name which will be sent to the server
sensor_name = "IoTMotionDetector"

# IoT server information
url = 'http://192.168.1.145:3005'
endpoint = "/sensordata/"+sensor_name
host = url+endpoint

# Declare pins
pir = 7
led = 11
gpio_switch = 13

# Setup GPIO inputs and outputs
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(pir,GPIO.IN)
GPIO.setup(led,GPIO.OUT)
GPIO.output(led,GPIO.LOW)
GPIO.setup(gpio_switch,GPIO.IN)

# DEBUG mode: Setting this to "True" will not send data to IoT server
debug = False

try:
    while True:
        while GPIO.input(gpio_switch)==1:
            # the switch is in the "on" position
            if(GPIO.input(pir)):
                # Motion is detected
                GPIO.output(led,GPIO.HIGH)
                if not debug:
                    sendData(host,"motion","true")
            else:
                # Motion is not detected
                GPIO.output(led,GPIO.LOW)
                if not debug:
                    sendData(host,"motion","false")
            # pause for 1 second
            time.sleep(1)
        # turn off the LED
        GPIO.output(led,GPIO.LOW)
# We need this so we can cleanup and free the GPIO when user terminates the program by pressing Ctrl-C
except KeyboardInterrupt:
    print("Stopping")
    GPIO.output(led,GPIO.LOW)
    GPIO.cleanup()
