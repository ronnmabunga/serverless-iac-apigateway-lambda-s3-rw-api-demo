const AWS = require("aws-sdk");
const s3 = new AWS.S3();
require("dotenv").config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_NAME = "contact-form-messages.json";

const getFileFromS3 = (bucket, key) => {
    return s3.getObject({ Bucket: bucket, Key: key }).promise();
};

const uploadFileToS3 = (bucket, key, data) => {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: "application/json",
    };
    return s3.putObject(params).promise();
};

exports.saveMessage = async (event) => {
    try {
        let parsedData = [];
        try {
            const currentData = await getFileFromS3(BUCKET_NAME, FILE_NAME);
            parsedData = JSON.parse(currentData.Body.toString());
        } catch (error) {
            if (error.code !== "NoSuchKey") {
                throw error;
            }
            console.log("File does not exist, creating a new one.");
        }
        const req = JSON.parse(event.body);
        parsedData.push(req);
        await uploadFileToS3(BUCKET_NAME, FILE_NAME, JSON.stringify(parsedData));
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Data updated successfully!" }),
        };
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: "An unexpected error occurred." }),
        };
    }
};
