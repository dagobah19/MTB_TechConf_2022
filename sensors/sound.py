import RPi.GPIO as GPIO
import time
import requests

#Clockwise = more sensitive
#Counter Clockwise = less sensitive

sound = 12
led = 11
GPIO.setmode(GPIO.BOARD)
GPIO.setup(sound, GPIO. IN)
GPIO.setup(led, GPIO.OUT)
GPIO.output(led, GPIO.HIGH)
soundstart = True
soundend= True
host=http://192.168.1.146:3005/sensordata/sound

try:
    while True:
        if GPIO.input(sound):
            GPIO.output(led, GPIO.HIGH)
            if soundstart:
                print("Sound")
                soundend = True
                soundstart = False
                r=requests.post(host, json-{"data": {"sound":"true"} })
            time.sleep(1)
        else:
            GPIO.output(led, GPIO.LOW)
            if soundend:
                print("Quiet")
                soundend = False
                soundstart = True
                r-requests.post(host, json-("data": "sound":"false"} })

except Keyboard Interrupt:
    print("Why'd you stop me? An I not good enough for you?")
    GPIO.output(led,GPIO,LOW)
    GPIO.cleanup()