# Race Gambit

A web-based app for sports betting on the Formula 1 Championship. This project demonstrates my knowledge in creating both the back-end and front-end using the Node framework.

## Technologies Used
* Javascript
* Node.js
* Express.js
* HTML
* SQL
* AWS
* CSS

## Description

_{Web-based platform where users can place bets on various categories of the Formula 1 Championship . Users are given a fixed amount of usable balance on account creation with additional balance getting added on a weekly basis. Users can create leagues or join one with the league search function and the league password. Leagues allow users to compare their betting performance with other users in the league. An SQL Database for all information used on the website is running on an AWS EC2 instance. Get and Post requests are made in order to alter the database.}_

# Sign-in Information for Guests
Please use the Guest Account Login Button

# Instructions/Features

1. Home page for users without an account
<img src="/public/images/readme/home.png" alt="Home Page" width="500" height="auto">

2. Account registration page
_{User account registration reguires the following informations. User password is stored in a hasted state on the database after it has passed through ByCrypt. After an account is created, the user will receive an email to verify their email. The email contains a GET request with a generated crypt that corresponds with their account in the database. The user needs to click on their verification link in order to activated their account. The user will receive an error when attempting to log in before verification.}_
<img src="/public/images/readme/register.png" alt="Registeration Page" width="500" height="auto">


3. Home page with a user logged in for both web and mobile
_{The home page after a user has signed in displays their ID badge with their account details.}_
<img src="/public/images/readme/loginhome.png" alt="Registeration Page" width="500" height="auto">
<img src="/public/images/readme/mobilehome.png" alt="Mobile Home" width="200" height="auto">
<img src="/public/images/readme/mobilemenu.png" alt="Mobile Menu" width="200" height="auto">

4. Betting page where users can place their bets before a race weekend
_{Users can place bets by specifying the amount they want to bet and their bet choice. Their bet is stored on the SQL database and is used to determine the winners after the race has occured.}_
<img src="/public/images/readme/betting.png" alt="Registeration Page" width="500" height="auto">
<img src="/public/images/readme/bettingmobile.png" alt="Registeration Page" width="200" height="auto">


5. League page 
_{Users are able to join and create leagues in order to compare their balance with friends. League creation requires a password and said password is required when attempting to join an existing league.}_
<img src="/public/images/readme/league.png" alt="Registeration Page" width="500" height="auto">

