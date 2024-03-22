Ecommerce API Documentation BE-


start backend-  npm start

DB- port change name


1. User Registration
Endpoint: POST /api/register

Description: Registers a new user with the provided details.

Request Body:

json
Copy code
{
    "name": "string",
    "email": "string",
    "password": "string"
}

2. Send OTP Email
Endpoint: POST /api/sendMail

Description: Sends an OTP email to the provided email address for verification.

Request Body:

json
Copy code
{
    "email": "string"
}


3. Verify OTP
Endpoint: POST /api/verifyMail

Description: Verifies the OTP sent to the user's email address.

Request Body:

json
Copy code
{
    "otp": "string",
    "email": "string"
}

4. User Login
Endpoint: POST /api/login

Description: Logs in an existing user and returns a JWT token for authentication.

Request Body:

json
Copy code
{
    "email": "string",
    "password": "string"
}
Response:

json
Copy code
{
    "token": "string"
}

5. Get Categories
Endpoint: GET /api/getCategory?page=1

Description: Retrieves a list of categories with pagination.

Authorization Header: Bearer token

Response:

json
Copy code
{
    "SCAT": [
        {
            "id": 3,
            "name": "Baby"
        }
    ],
    "DSCAT": [
        {
            "id": 1,
            "name": "Kids"
        },
        {
            "id": 2,
            "name": "Sports"
        },
        {
            "id": 4,
            "name": "Books"
        },
        {
            "id": 5,
            "name": "Toys"
        },
        {
            "id": 6,
            "name": "Kids"
        }
    ],
    "totalPages": 33
}

6. Toggle Category Selection
Endpoint: PATCH /api/category/isSelect

Description: Toggles the selection of a category.

Authorization Header: Bearer token

Request Body:

json
Copy code
{
    "categoryId": 3,
    "isSelected": true
}
