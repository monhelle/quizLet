###SK 
https://docs.google.com/spreadsheets/d/1xk2VAtbLkK2SJYJVeFATKuuAMIIsepWAgEg7-Inzfc0/edit?usp=sharing


# Project Setup and Prerequisites

This document provides a step-by-step guide to setting up the prerequisites and configuring the project environment to run locally. Please follow each step carefully.

---

## Prerequisites

### 1. Install Node.js and npm

Node.js is required to run the server and manage dependencies. It comes bundled with npm, the Node Package Manager, which will be used to install project dependencies.

- **Installation**: Download and install Node.js from the official website (replace with actual URL).
- **Version**: Node.js version 14.x or later is recommended.

  **[Download Node.js](https://nodejs.org/dist/v22.11.0/node-v22.11.0.pkg)**

To verify the installation, open a terminal and run:

```bash
node -v
npm -v
```


### 2. Install MongoDB
MongoDB is the database for this project. You can set it up locally or use MongoDB Atlas, a cloud-based solution.

Local Installation: Download and install MongoDB Community Edition for a local database.

Cloud Option: Alternatively, sign up for MongoDB Atlas and get a connection URI for a hosted database.

Version: MongoDB 4.4 or later is recommended.

Download MongoDB
**[Download MongoDB](https://www.mongodb.com/try/download/community)**

To verify MongoDB installation, run:

```bash
mongod --version
```

### 4. Install Cursor SO
Cursor is an AI code editor. 
Built to make you extraordinarily productive, Cursor is the best way to code with AI, especially when we are going to code for 2.5 hrs.


Commands

You need to enable composer first before you can use it in the **settings** section (hit settings wheel on the right hand side)

CMD + Shift + P = Command pallete. Write New Composer or New Chat and it will open
CMD + Shift + I  // CTRL + Shift + I = Composer
CMD + K // CTRL + K = AI helper in the text file
Tab -> auto fill

Download Cursor
**[Download Cursor](https://www.cursor.com/)**

### 3. Set Up React
React is used to build the frontend of this application. To install and initialize the project with React, use the following command:

```bash
npx create-react-app aibot
```

Note: The above command will create a new React project. You can replace my-app with your project name if preferred. If you're working with an existing project, React dependencies will be installed automatically with npm install in the project root directory.

After running npm install, you can launch the React application:

```bash
npm start
```
It will then run it on http://localhost:3000


### 4. Environment Configuration
Create a .env file in the project root directory to store environment-specific variables, such as the MongoDB URI and server port. This file will be read by the application during runtime.

Example .env file:
```plaintext
MONGODB_URI=mongodb://localhost:27017/mydatabase
PORT=3000
MONGODB_URI: Replace mydatabase with the actual name of your database.
PORT: The port for running the application. Default is usually 4000.
For MongoDB Atlas users, use the URI provided in the Atlas dashboard.
```

### 5. Installing Project Dependencies
Once you have cloned the project repository, navigate to the project directory and install dependencies using npm:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

Starting the Development Environment
After setting up dependencies and environment variables, start the development server with the following command:

```bash
npm start
```
This command should start both the backend (Node.js server) and frontend (React) services if configured correctly. 
Open http://localhost:3000 in your browser to view the application.

### 6. Summary of Installation Links
For your convenience, here are quick links to the prerequisites:

Node.js
MongoDB
MongoDB Atlas
Visual Studio Code
