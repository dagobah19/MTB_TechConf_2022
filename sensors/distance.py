# Connecting an IR distance sensor requires and analog/digital converter chip (MCP3008)
# It also requires a few libraries that can be installed using pip3/pip

import time
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008
import sendData

# define the pins on the MCP3008 we will be using, and mapping them to the pi
# the var is the name of the chip pin/function and the number is the Pi GPIO
CLK = 18
MISO = 23
MOSI = 24
CS = 25

# define the time to wait between taking another reading, in seconds
# setting this value too low will slow down the script, as we have to wait for the 
# request to the server to complete
delay = 5

# define the server and sensor name
sensor_name="distance"
url = 'http://192.168.1.145:3005'
endpoint = "/sensordata/"+sensor_name
host = url+endpoint

# setup the chip
mcp = Adafruit_MCP3008.MCP3008(clk=CLK, cs=CS, miso=MISO, mosi=MOSI)

try:
    while True:
        v = (mcp.read_adc(0) / 1023.0) * 3.3
        # SCIENCE! MATH! Who said we'd never use what we learaned in high school!!
        dist = 16.2537 * v**4 - 129.893 * v**3 + 382.268 * v**2 - 512.611 * v + 301.439
        print("Distance in cm {:.2f}".format(dist))
        dist_inch = dist / 2.54
        print("Distance in Freedom Units {:.2f}".format(dist_inch))
        sendData(host,"distance",dist_inch)
        time.sleep(delay)
except KeyboardInterrupt:
    print("Farewell, freedom lover")
