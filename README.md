
# Flight Tracker System

The frontend of the application is built with ReactJS, while the backend is developed using Flask (Python), PostgreSQL is used as database and RabbitMQ is used for Messaging Queue. Users have the ability to sign up and log in. Flight results are accessible to all users, but only logged-in users can add flights to their watchlist. Flight tracking is powered by the Aviation Stack API. Users receive email notifications for any changes in their watchlist flights, including updates to gate, time, and status. The notification system is integrated with RabbitMQ for efficient message handling.




## How to make it work

1. First we have to run the docker compose file provided to run and install the docker images of RabbitMQ and PostgreSQL
```
docker compose -d up
```

2. Create database after logging into database of name 'flights_db', we can either connect using pgAdmin or psql client the port used is 5433 and the password is '1234'.


## Usage
1. First run the backend and flight consumer using the commands ```python run.py``` and `python flight_consumer.py` and make sure you have added sender email and sender password in flight consumer's config otherwise notification functionality won't work.

2. Next up open the Frontend and install the Node Modules required to run the app. 
```npm i```

3. Now run the front-end using the command 
```
npm start
```



## Screenshots
Homepage
![App Screenshot](https://i.ibb.co/2yMkwx3/homepage.png)

Signup
![App Screenshot](https://i.ibb.co/5FrpxP6/signup.png)

Login
![App Screenshot](https://i.ibb.co/xC6rGdj/login.png)

Flight Result 
![App Screenshot](https://i.ibb.co/bXcCN70/flight-results.png)

Watchlist
![App Screenshot](https://i.ibb.co/jLZP09R/watchlist.png)

Notification Received on any update in flight
![App Screenshot](https://i.ibb.co/nPxTbDp/demo-response.png)







