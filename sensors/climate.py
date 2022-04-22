# using the DHT22 sensor we can get temperature and humidity
# To simplify our coding we can use the Adafruit libraries
# install them using pip/pip3
# pip3 install adafruit-circuitpython-dht
# pip3 install libgpiod
# this should install all the pre-reqs

import time
import board
import adafruit_dht
import requests

# time in seconds to wait in order to grab another reading
delay = 2

# sensor name and server information
sensor_name = "climate"
url = 'http://192.168.1.146:3005'
endpoint = "/sensordata/"+sensor_name
host = url+endpoint

dht = adafruit_dht.DHT22(board.D4, use_pulseio=True)

while True:
    try:
        # get the temperature & humidity
        temp = dht.temperature
        temp_f = temp * (9/5) + 32
        humidity = dht.humidity
        # output the values to the screen
        print("Temp: {:.1f}C {:.1f}F Humidity: {}% ".format(temp,temp_f,humidity))
        # send to server
        try:
            r = requests.post(host,json={"data":{"temp":temp_f,"humidity":humidity}})
        except requests.exceptions.RequestException as e:
            # catch request exceptions and print them, then just assign a temp return for request r
            print(e)
            r="Bad"
    except RuntimeError as error:
        # the sensor is error prone, so we setup a general exception handler to continue on runtime exceptions
        print(error.args[0])
        time.sleep(delay)
        continue
    except Exception as error:
        # all other exceptions other than runtime would trigger a stop
        dht.exit()
        raise error
    time.sleep(delay)