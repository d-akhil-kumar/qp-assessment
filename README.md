# Grocery Pro
### The QuestionPro assessment

GroceryPro streamlines grocery shopping, allowing users to efficiently select and purchase multiple items at once. 
Powered by TypeScript and Node.js with Express, its backend service seamlessly stores data in PostgreSQL for optimal performance.

## Features

- Admin
    - Admin login
    - bulk create, categorize, and manage items
    - Maintain inventory seamlessly
    - Remove items with ease
    - Access comprehensive item details


- Customer
    - SignIn/SignUp functionality
    - Browse and search items and also by category
    - Manage cart
    - Book multiple grocery items in a single order


- Cross-cutting concerns
    - Authorisation and Authentication
    - Secure password encryption
    - Effective error and request logging
    - Rigorous request validation


## Tech

GroceryPro uses a number of open source projects to work properly:
- nodeJS
- expressJS
- typeScript
- postgreSQL
- typeORM
- docker


## How To run (docker)

GroceryPro server is very easy to install and deploy in a Docker container.

> Note: Create a `.env` file in the root directory by referring to the provided `.env.sample` for keys.

Build and run the Docker image and container using the provided docker-compose file.

```sh
docker-compose up --build
```

This command creates the "qp-assessment-server" image, pulls in necessary dependencies,
and runs the containers on the port specified in the `.env` and `docker-compose.yml` files.

Verify the server deployment by accessing the following endpoint
```sh
http://127.0.0.1:8008/ping
```



Once done, open the terminal and access the container in interactive mode
(OS: windows)
```sh
docker exec -it server sh
```
Once inside the container shell, run the following command to seed items and categories data. 
```sh
npm run seed
```
This command initializes data for testing and interacting with the services.
Or, you can logged in as an admin to create items and categories


**Enjoy the work, and have fun!**