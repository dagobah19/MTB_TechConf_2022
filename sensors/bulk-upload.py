# For usage details, see README file

svcURL = 'http://192.168.1.146:3005'
pathToData = '/home/pi/IoT/'

# import everything we need
import os.path, os, time, requests

# we need to figure out which file is in use

if os.path.isfile(pathToData+"use.1"):
  #switch to use.2
  #purge file2 contents first
  with open(pathToData+'file2.raw', 'w') as f:
        f.seek(0)
  os.rename(pathToData+"use.1",pathToData+"use.2")
  src = pathToData+"file1.raw"
else:
  #go to use.1
  #purge file1 contents
  with open(pathToData+'file1.raw', 'w') as f:
        f.seek(0)
  os.rename(pathToData+"use.2",pathToData+"use.1")
  src = pathToData+"file2.raw"

time.sleep(1) #rest for 1 second so file can switch over

#now we open the file and read the contents into the data variable
with open (src, "r") as myfile:
  data=myfile.read().replace('\r\n', '')
  #data=myfile.read()
  data = data[1:] # remove the first comma

# POST the data
r = requests.post(svcURL, json={
    data
})