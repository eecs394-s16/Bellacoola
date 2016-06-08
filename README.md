#### ![pageres](client/www/assets/logo.png)

## Bellacoola - A 21st Century Doorbell
=====================================

### Description

What you have on your door is a 20th century doorbell - outdated, stupid, and sub-par. Bellacoola brings your doorbell to the 21st century tech wizardary. 

Using a Raspberry Pi, Bellacoola can make your doorbell:

- Silence doorbell, and instead have notifications sent to users' phones
- Customize doorbell ring tone and playlist

### Codebase Structure

- server: Server code hosted on Heroku, used as API endpoint to send text
- client: Mobile app for Android or iOS
- pi: Client on Rasperry Pi


### Installing
```bash
git clone https://github.com/eecs394-s16/Bellacoola
```

### Building and Deploying

####Mobile Client: 
Deploy:
- Install Supersonic following instructions here: http://www.appgyver.io/supersonic/
- Install NodeJS 4 and NPM 2
-Run the following:

```bash
npm install steroids -g
# in the client directory
npm install 
steroids connect
```

A browser tab should open with a QR code.

Install on mobile:
-Download the Appgyver Scanner app
-Scan the QR code 


#### Raspberry Pi

```bash
pip install requests
```

