# ITIDONodeJS-Project

Book app created with NodeJS and React.

# How to start the backend (NodeJS):

1. Go to app's folder and run the following commands:
    
    - npm install
    - npm start

# How to start the frontend (React):

1. Go to the client's folder with the following command:

    - cd app'sfolder/client

2. After that run the following commands to start it:

    - npm install
    - npm start

Please note that 'npm install' is ran only once in order to install the required dependences.

# How to start the database:

1. Install postgres on your machine. You can download it from the official website:

    - https://www.postgresql.org/download/

2. Use the following command in the terminal to create a database for the project named 'book-app':

    - psql -U postgres -c "CREATE DATABASE book-app;"

3. Please note that you will need a separate database for testing purposes:

    - psql -U postgres -c "CREATE DATABASE book-app-test;"

4. Once the databases are ready the tables should be created, but first connect to them:

    - psql postgres://postgres:secretphrase@localhost:5432/book-app

5. Run the following command to create the tables:

    - CREATE TABLE book(name TEXT, description TEXT, rating int, created_by int REFERENCES user(id), cover bytea);
    - CREATE TABLE user(id int PRIMARY KEY, name TEXT, email TEXT, password TEXT, tokens datatype[]);

6. Next, set the relationship between the User and the Book model:

    - AFLTER TABLE book ADD CONSTRAINT fk_user FOREIGN KEY(created_by) REFERENCES user(id);

7. Do the same for book-app-test database.
