# Yape-Internship
ROUTES:
/ - SHOWS USER UPLOAD FILE OPTION
/hello - SHOWS USER HELLO WORLD
/uploads - displays all the files uploaded, Now protected With google Oauth
/uploads/name.jpg -displays specific photo

OAUTH
-User is redirected to OAuth page from uploads and a token is taken from the login then stored in memory via token service. Then it is callbacked to Uploads?token. Uploads is protected by a token gaurd that checks the URL or Token storage for the token to let the user through.