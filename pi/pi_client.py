import requests
import firebase

def ring(ringtone=''):
    '''
        This is the callback function when the HW button is pressed.
        It checks the current settings for this Pi and takes the appropriate action
    ''' 

    # Check current settings
    # TODO: This should probably go into the rest API 
    # Thankfully firebase-python is an unofficial hack that wraps Firebase for Python 
    # so we'll use this for now

    fb = firebase.FirebaseApplication('https://bellacoola.firebaseio.com', None)
    settings = fb.get('/testsettings', None)

    # Silent
    if settings[u'silence']:
        ring = requests.get('http://desolate-scrubland-96510.herokuapp.com/ring')
    else:
        print 'PLAY SOUND!!'



if __name__ == '__main__':
    while True:
        user = raw_input('Type anything to ring the bell')
        ring()
