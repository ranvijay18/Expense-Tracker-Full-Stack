const AWS = require('aws-sdk');


const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = "expensetrackertesting";
    const IAM_USER_KEY = process.env.AWS_KEY_IAM_USER;
    const IAM_USER_SECRET_KEY = process.env.AWS_KEY_SECRET_IAM_USER;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET_KEY,
        bucket: BUCKET_NAME
    })


    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                reject(err);
            } else {
                // console.log("Success", s3response);
                resolve(s3response.Location);
            }
        })
    })



}

module.exports = {
    uploadToS3
};