import requests
import firebase
import pygame

# server API endpoint
#ENDPOINT = 'http://desolate-scrubland-96510.herokuapp.com'
ENDPOINT = 'http://localhost:5000'

# hard-coded Pi UID
UID = 1

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
        print 'PLAY SOUND!!'

    
def play_sound(ringtone):
    pygame.mixer.init()
    pygame.mixer.music.load('sounds/' + ringtone + '.wav')
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        continue


if __name__ == '__main__':
    play_sound('bird')
'''
    while True:
        user = raw_input('Type anything to ring the bell')
        ring()
'''
    
