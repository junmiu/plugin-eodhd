# EODHD Plugin

## Description
This project is an Express-based application that provides an API for accessing EODHD data. It includes JWT authentication for secure access to the data endpoints.

## Features
- JWT authentication for secure API access
- Login route to generate JWTs
- Protected route to fetch data from EODHD API

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd plugin-eodhd
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your secret key:
   ```
   SECRET_KEY=your_secret_key
   NO_AUTH=false
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. To log in and obtain a JWT, send a POST request to `/login` with the following JSON body:
   ```json
   {
       "accessKey": "foobar"
   }
   ```

3. Use the obtained JWT to access protected routes. Include the token in the `Authorization` header as follows:
   ```
   Authorization: Bearer <your_token>
   ```

4. To fetch data from the EODHD API, send a POST request to `/data` with the following JSON body:
   ```json
   {
       "code": "AAPL",
       "eodhd_token": "<your_eodhd_token>",
       "ymd_from": "2023-01-01",
       "ymd_to": "2023-01-31"
   }
   ```

## License
This project is licensed under the MIT License.