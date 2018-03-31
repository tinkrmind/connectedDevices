# connected devices

This repositiory is documentation for [Connected Devices Spring-2018](https://itp.nyu.edu/classes/connected-devices/)

## Week 1

![landingPage](https://i.imgur.com/6NrUbRX.png)

I made an HTML puzzle with expressjs. The puzzle is live [here](http://as11613.itp.io:8080). Give it a shot!

There are multilple levels and you proceed by various methods, like manipulations URLs, finding hidden links, and solving riddles to get passwords.

## Week 2

I controlled a Philips Hue bulb via a node webserver web server. The bulb is controlled by submitting an image into the server. The server then extracts a color palette from the image and cycles the bulb through those colors.

I used nodejs library [get-image-colors](https://www.npmjs.com/package/get-image-colors) to extract color palette. The philips hue [API](https://www.developers.meethue.com/documentation/getting-started) was the major source of code for controlling the hue. The hue is controlled via http get requests directly without any additional library.

## Week 3

![Rssis](https://i.imgur.com/Dyhqvkf.png)

This week I made a Wifi scanner using ESP8266. I am currently implementing it to map RSSI of various routers on the college floor. I expect this heat map can then be used to extract indoor position via nearest neighbor mapping of RSSI. 

![Floor Scan](https://i.imgur.com/fbCbOuf.png)

Locations of scanned ares.

![code](https://i.imgur.com/qnkTU0r.png)

The backend server gets location as mouse X and Y coordinated on a mousePress event. This can readily be converted to indoor location or mapped to the same map without needing to triangulate.

## Week 4

I setup this connected thermostat using a RaspberryPi ZeroW. The server was setup with security in mind as it is on a publically visible static IP address. Check out if I've been hacked yet here.
