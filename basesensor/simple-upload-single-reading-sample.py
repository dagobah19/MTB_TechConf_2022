# This module demonstrates reading data from a sensor
# and posting the data immediately to an api or web service
# This is well suited for a sensor that occasionally sends data, such as when 
# on a specific occurrence such as motion detected, or when when temp reaches
# a threshold, etc.

# import everything we need
import requests

# read sensor data


# POST the data
r = requests.post('http://1.2.3.4', json={
    "identifier":"value",
    "ident2":"val2"
})