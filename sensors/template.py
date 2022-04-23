# This is a basic template to build your script/sensor on using the GPIO library in RPi

import RPi.GPIO as GPIO
import time
import sendData

# Sensor name which will be sent to the server
sensor_name = "NAME_OF_SENSOR"

# IoT server information
url = 'http://192.168.1.146:3005'
endpoint = "/sensordata/"+sensor_name
host = url+endpoint

# Declare pins
# HERE you will want to define a variable name to a GPIO pin
# FORMAT: 
# var_name = pin_number

# Setup GPIO inputs and outputs
# Based on the variables you input above, we need to set GPIO to either be an input or output
# FORMAT:
# GPIO.setup(var_name, GPIO.IN || GPIO.OUT)
#
# If you have an output, such as an LED, you should define a starting state of the output
# GPIO.LOW is low voltage, or "off", GPIO.HIGH is high voltage or "on"
# You can also pass a value between 0 and 255 to create a dimming effect
# FORMAT: GPIO.output(var_name, GPIO.LOW || GPIO.HIGH)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

# We can establish a sleep value, which delays execution until the time elapses
sleep_time = 5

# DEBUG mode: Setting this to "True" will not send data to IoT server
debug = False

try:
    # this makes the loop run forever unless there is a crash/exception or keyboard interrupt (CTRL-C)
    while True:
        # This is where your logic would be to read sensor input, set output, send data to the server module, etc
        time.sleep(sleep_time)

# We need this so we can cleanup and free the GPIO when user terminates the program by pressing Ctrl-C
except KeyboardInterrupt:
    print("Stopping")
    
    # once we stop, if we have any outputs such as an LED or buzzer, we want to turn it off. Otherwise it will be in that state even after the program terminates
    # EXAMPLE:
    # GPIO.output(var_name,GPIO.LOW)

    # this cleans up and frees the GPIO setup
    # if we didn't include this, when we start the script again we may get a warning that the pins are already assigned
    GPIO.cleanup()
