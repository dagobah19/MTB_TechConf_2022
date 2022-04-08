# simple function that sends single data
import requests

def sendData(host,key,val):
    try:
        r = requests.post(
            host, json={
                "data":{
                    key:val
                    }
                }
            )
    except requests.exceptions.RequestException as e:
        print(e)
        r="Bad"
