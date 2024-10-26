# Serverless Read-Write access API (Using AWS APIGateway-Lambda-S3)

## Description

This repository is a code demonstration of a read and write application that allows processing of an S3 object by a Lambda function, that is accessed through an API Gateway secured by an API Key. It contains an AWS Serverless Application Model (SAM) template that serves as a form of Infrastructure as Code (IaC). It allows you to deploy a serverless stack integrating API Gateway, Lambda, and S3. The deployed API provides read and write functionality for an S3 object through a Lambda function. Access to the API is secured via an API Key managed through a Usage Plan.

The Lambda function is implemented in Node.js and uses the aws-sdk to interact with S3, along with dotenv for environment configuration.

The API can receive a JSON document which is appended to the JSON array object stored in the S3 bucket. This will be used as the backend for the storage of messages sent through contact forms from my personal websites.

## Features

-   **Infrastructure as Code (IaC)**: Automate deployment of resources using an AWS Serverless Application Model (SAM) template, ensuring consistency and reproducibility.
-   **Read and Write to S3 Object:** API Gateway routes map to a Lambda function that reads and writes data to a JSON file stored in an S3 bucket.
-   **API Key Security:** Access to the API is secured with an API Key and Usage Plan.
-   **Modular Policies:** Lambda is provisioned with necessary read and write permissions for the S3 bucket.

# How to Run

## Prerequisites

1. **AWS CLI** installed and configured with access to deploy resources.
2. **SAM CLI** installed for deployment (pip install aws-sam-cli).
3. **Node.js** installed with npm to manage dependencies.
4. **AWS Account** with necessary IAM permissions to deploy Lambda, API Gateway, and S3 resources.
5. **Git** installed.

## Deployment Steps

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/ronnmabunga/serverless-iac-apigateway-lambda-s3-rw-api-demo.git
    cd aws-api-gateway-lambda-s3
    ```

2. Install Dependencies:

    ```bash
    cd lambda
    npm install aws-sdk dotenv
    cd ..
    ```

3. Build and deploy the application:

    ```bash
    sam build
    sam deploy
    ```

    - Note: S3 bucket names must be globally unique. To deploy this without errors, the template must be updated.
        - **Replace the bucket name:**
            ```yml
            BucketName: <different-globally-unique-bucket-name>
            ```

4. After deployment, retrieve the API key:

    ```bash
    aws apigateway get-api-keys --name-query ContactFormApiKey --include-values
    ```

5. Use the API key to interact with the API via Postman or any HTTP client.

## API Routes Overview

-   **POST /prod:** Adds the request body to the array of messages on file.
-   **GET /prod:** Retrieves the messages on file.

## API Key Authentication

-   All routes require an API Key.
-   In Postman (or in any HTTP Client), add the API Key on the request Headers:
    -   Key: x-api-key
    -   Value: `<your-api-key>`

## Sample Hosted API and Credential:

-   https://y528c8do2c.execute-api.ap-southeast-1.amazonaws.com/prod/
    -   Key: JvhkaNnDRJ3FvfB4V8loq5jfB6RIP6rS5NZX1ljO
-   **Sample Request:**

    ```json
    {
        "name": "Visitor",
        "message": "Hello from the API!"
    }
    ```

## Dependencies

    aws-sdk: Official AWS SDK for interacting with AWS services.
    dotenv: Loads environment variables.

# License

    This project is licensed under the GNU GENERAL PUBLIC LICENSE.

# Troubleshooting & Useful Commands

-   Check API Gateway endpoints:

    ```bash
    aws apigateway get-rest-apis
    ```

-   Verify Lambda logs:

    ```bash
    sam logs -n ContactFormApiSaveMessage --stack-name contact-form-stack --tail
    sam logs -n ContactFormApiRetrieveMessage --stack-name contact-form-stack --tail
    ```

-   Delete the stack:

    ```bash
    aws cloudformation delete-stack --stack-name contact-form-stack
    ```
