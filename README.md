# CRM Project Backend

## Overview

The backend of the CRM Project serves as the server-side application handling data management, authentication, and API services for the CRM system. It is built with Node.js and Express, providing a scalable foundation for managing customer relationships and interactions.

Swagger documentation:

http://localhost:8080/api-docs/

## Features

- **Secure Authentication**: Utilizes JWT and bcrypt for secure authentication and user management.
- **RESTful API**: Offers a comprehensive set of API endpoints for CRUD operations on customer data.
- **Data Validation**: Implements Joi for robust request validation to ensure data integrity.
- **Documentation**: Integrated Swagger for API documentation and testing.

## Technologies Used

- **Express**: Web framework for Node.js, handling routing and middleware.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **jsonwebtoken & bcrypt**: For secure authentication and password hashing.
- **Swagger**: For API documentation and an interactive API console.
- **TypeScript**: Adds static type checking to the backend, improving reliability and maintainability.

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system. [Download Node.js](https://nodejs.org/)
- **MongoDB**: Ensure you have MongoDB installed and running. [Download MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the Repository**

   Open a terminal and clone the repository using the following command:

   ```bash
   git clone https://github.com/DevMari999/crm-backend
   cd crm-project
   ```


2. **Install Dependencies**

   While in the project directory, run the following command to install the required dependencies:

   ```bash
   npm install
   ```

### Running the Application

1. **Start the Server**

   Run the following command to start the backend server:

   ```bash
   npm start
   ```

   This will compile the TypeScript code and start the Express server.

2. **Accessing the API**

   Once the server is running, you can access the API endpoints at `http://localhost:3000` (or the configured port).

### Using the API Documentation

- Navigate to `http://localhost:3000/api-docs` to view the Swagger API documentation and interact with the API.

## Development and Testing

- **Development Mode**: Run `npm run watch` to start the server in development mode with hot reloading.
- **Testing**: Implement testing as needed using your preferred JavaScript testing framework.

## Deployment

Ensure you have environment variables set up for production, including database connections and any API keys or secrets.

## Contribution

Contributions are welcome. Please fork the repository and submit pull requests with your changes.

## License

Specify your license here, commonly used is the MIT license for open-source projects.

