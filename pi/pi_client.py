import requests
import firebase
import pygame

# server API endpoint
#ENDPOINT = 'http://desolate-scrubland-96510.herokuapp.com'
ENDPOINT = 'http://localhost:5000'

# hard-coded Pi UID
UID = 1


def update_uid():
    '''
        This updates the global variable UID with the Raspberry Pi's serial number
    '''
    global UID
    # Extract serial from cpuinfo file
    cpuserial = "0000000000000000"
    try:
        f = open('/proc/cpuinfo','r')
        for line in f:
            if line[0:6]=='Serial':
                cpuserial = line[10:26]
        f.close()
    except:
        cpuserial = "ERROR000000000"
    UID = cpuserial


def ring(ringtone='bird'):
    '''
        This is the callback function when the HW button is pressed.
        It checks the current settings for this Pi and takes the appropriate action
    ''' 
    # Check current settings
    query = { 'uid': str(UID) }
    setting = requests.get(ENDPOINT + '/isSilent', params=query).text

    # Silent
    if setting == 'true':
        ring = requests.get(ENDPOINT + '/ring', params=query)
    else:
        play_sound(requests.get(ENDPOINT + '/ringtone', params=query).text)

    
def play_sound(ringtone):
    pygame.mixer.init()
    pygame.mixer.music.load('sounds/' + ringtone + '.wav')
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        continue


if __name__ == '__main__':
    update_uid()
    print UID
    while True:
        user = raw_input('Type anything to ring the bell')
        ring()
    
