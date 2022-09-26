import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION
export async function getSignedUrl(todoId: string) {
    return await s3.getSignedUrl('putObject', {
        Bucket: process.env.TO,
        Key: todoId,
        Expires: signedUrlExpiration
    })
}