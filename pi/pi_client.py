import requests
import firebase

# server API endpoint
ENDPOINT = 'http://desolate-scrubland-96510.herokuapp.com'
#ENDPOINT = 'http://localhost:5000'

# hard-coded Pi UID
UID = 1

def ring(ringtone=''):
    '''
        This is the callback function when the HW button is pressed.
        It checks the current settings for this Pi and takes the appropriate action
    ''' 
    # Check current settings
    setting = requests.get(ENDPOINT + '/isSilent?uid=' + str(UID)).text

    # Silent
    if setting == 'true':
        ring = requests.get(ENDPOINT + '/ring')
    else:
        print 'PLAY SOUND!!'

if __name__ == '__main__':
    while True:
        user = raw_input('Type anything to ring the bell')
        ring()
