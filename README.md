This is a base nodejs project template, ehich anyone can use as it has been prepared by keeping some of the most important code principles and project management recommendations.


`src`-> INside the src folder all the actual source code regarding the project will reside this will not include any kind of tests.

Lets take a look inside the `src` folder

- `config` -> In this fokder anything and everythinng regarding any configurations of setup of a library or module will be done. For example: setting up dotenv so that we can use the environment variables anywhere in a cleaner fashion, this is done in the server-config.js". One more example can be to setup you logging library that can help you to prepare meaningful logs, so configuration for this library should also be done here.

- `routes` -> In the routes folder, we register a route and the corresponding middleware and controllers to it.

- `middlewares` -> they are just going to intercept the incoming requests where we can write our validators, authenticators etc.

- `controllers`-> they are kind of the last middlewares as post them you call you business layer to execute the budiness logic. In controllers we just receive the incoming requests and data and then pass it to the business layer, and once busines layer returns an output, we structure the API response ingcontroller trollers and send the output.

- `repositories` -> this folder contains all the logic which we interact th DB by writing queries, all the raw queries or ORM qureies will go there.

- `services` -> contains the business logic and interacts with repositories for data from the DB.

- `utils` -> contains helper methods, error classes etc.

### Setup the project 

- Download this template from github and open it in your favourite text editor.

```
npm install
```

- In the root directory create a `.env` file and add the following env variables
```
PORT=<port number of your choice>
```
ex:
```
PORT=3000
```
- go inside  the `src` folder axecute the following command:
```
npx sequelize init
```

- by executing the above command you will get migration, seeders folder and config.json inside config folder.
<!-- - Inside the 'src/config folder create a file named as `config.json` and write them following code: 

```
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
``` -->
- If your setting up your development env, then write the username of your db, password of your db and in dialect mention whatever db you are using for ex: mysql, maraidb, etc.

- If you're setting up test or prod environment, make sure you also replace the host with hosted url

- to run the server

```
npm run dev
```