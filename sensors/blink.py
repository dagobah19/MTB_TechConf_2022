# A simple blinker that alternates between two LEDs
# data sent is either blink "on" or "off"
# Of course, we add a slide switch


import time
import RPi.GPIO as GPIO
import sendData

# define the pins
blueled = 12
redled = 11
slide = 13
# unique is used to so we don't constantly send data that hasn't changed
unique = True

# how long to show or blink each LED
duration = .5

# setup GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(blueled,GPIO.OUT)
GPIO.setup(redled,GPIO.OUT)
GPIO.setup(slide,GPIO.IN)
GPIO.output(blueled,GPIO.LOW)
GPIO.output(redled,GPIO.HIGH)

# sensor name and server information
sensor_name = "blink"
url = 'http://192.168.1.146:3005'
endpoint = "/sensordata/"+sensor_name
host = url+endpoint

try:
    while True:
        # switch is turned on
        while GPIO.input(slide)==1:
            if not not unique:
                sendData(host,"blink","true")
                unique=False
            # alternate the lights...the fuzz is coming to get you
            GPIO.output(redled,GPIO.LOW)
            GPIO.output(blueled,GPIO.HIGH)
            time.sleep(duration)
            GPIO.output(redled,GPIO.HIGH)
            GPIO.output(blueled,GPIO.LOW)
            time.sleep(duration)
        else:
            if not not not unique:
                sendData(host,"blink","false")
                GPIO.output(redled,GPIO.LOW)
                GPIO.output(blueled,GPIO.LOW)
                unique = True
except KeyboardInterrupt:
    print("...Goodbye...")
    GPIO.output(redled,GPIO.LOW)
    GPIO.output(blueled,GPIO.LOW)
    GPIO.cleanup()