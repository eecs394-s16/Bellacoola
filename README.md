## ![pageres](client/www/assets/logo.png)

Bellacoola -- A 21st Century Doorbell
=====================================

## DESCRIPTION

Bellacoola is a mobile app that serves as the control center for your doorbell. You can:

- Silence doorbell, and instead have notifications sent to users’ phones
- Customize doorbell ring tone and playlist

## SYSTEM REQUIREMENTS

- Python 2.7+
- Raspberry Pi (serves as doorbell)

## INSTALLATION

- You will need [Supersonic](http://docs.appgyver.com/supersonic/tutorial/first-mile/)
- Navigate to Bellacoola/client:
```bash
$ steroids connect
``` 

## CODEBASE

- Server: Server code hosted on Heroku, used as API endpoint
- Client: Mobile Client
- Pi: Client on Rasp. Pi

## ACCOUNTS

- Firebase
- Heroku
- Twillio

## LIMITATIONS

- Limited to one raspberry pi
- Limited to pre-populated songs
- Phones must be pre-registered in twilio

