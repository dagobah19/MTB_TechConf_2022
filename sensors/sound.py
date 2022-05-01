# This is a sound sensor that returns a value if sound is detected

import RPi.GPIO as GPIO
import time
import requests

# You can adjust sensitivity of the sound detector using the hardware screw on the sensor
# Clockwise = more sensitive
# Counter Clockwise = less sensitive

# Sensor name which will be sent to the server
sensor_name = "sound"

# IoT server information
url = 'http://192.168.1.146:3005'
endpoint = "/sensordata/"+sensor_name
host = url+endpoint

# declare pins
sound = 12
led = 11

# Setup GPIO inputs and outputs
GPIO.setmode(GPIO.BOARD)
GPIO.setup(sound, GPIO.IN)
GPIO.setup(led, GPIO.OUT)
GPIO.output(led, GPIO.HIGH)

# We need these to control sound state "changes" so we don't bombard the server with nonsense requests
soundstart = True
soundend= True

# DEBUG mode: Setting this to "True" will not send data to IoT server
debug = False

try:
    while True:
        if GPIO.input(sound):
            # we detected sound
            GPIO.output(led, GPIO.HIGH)
            if soundstart:
                print("Sound")
                soundend = True
                soundstart = False
                if not debug:
                    try:
                        r = requests.post(host, json={"data":{"sound":"true"}})
                    except requests.exceptions.RequestException as e:
                        print(e)
                        r="Bad"
            time.sleep(1)
        else:
            # no sound
            GPIO.output(led, GPIO.LOW)
            if soundend:
                print("Quiet")
                soundend = False
                soundstart = True
                if not debug:
                    try:
                        r = requests.post(host, json={"data":{"sound":"false"}})
                    except requests.exceptions.RequestException as e:
                        print(e)
                        r="Bad"
# We need this so we can cleanup and free the GPIO when user terminates the program by pressing Ctrl-C
except KeyboardInterrupt:
    print("Why'd you stop me? An I not good enough for you?")
    GPIO.output(led.GPIO.LOW)
    GPIO.cleanup()
