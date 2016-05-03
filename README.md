## Repo for Team Orange Client Project - Bellacoola


### Codebase Structure

- Server: Server code hosted on Heroku, used as API endpoint
- Client: Mobile Client
- Pi: Client on Rasp. Pi


### Backend Structure
Backend is essentially two huge JSOn

'Clients' = {
    'key': unique_id,
    'mode': call / text / [ring],
    'pi': key_to_pi // Array of Raspberry pis that users are associated to
}

'Pi' = { 
    'key': unique_id,
    'mode': call /text /[ring],
    'pi': key_to_client // Client IDs that this pi is associated to (i.e. can support multiple devices with one Pi)
}
