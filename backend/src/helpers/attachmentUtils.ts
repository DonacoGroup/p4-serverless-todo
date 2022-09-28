import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {TodoItem as Todo} from "../models/TodoItem";
import {TodoAccess} from "./todoAccess";

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic - DONE
export class AttachmentUtils {
    private signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION

    constructor(
        private readonly s3 = createS3Client(),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET){}

    async getSignedUrl(todoId: string) {
        return await this.s3.getSignedUrl('putObject', {
            Bucket: process.env.ATTACHMENT_S3_BUCKET,
            Key: todoId,
            Expires: this.signedUrlExpiration
        })
    }
    async createAttachmentUrl(todo: Todo) {
        const todoAccess = new TodoAccess()
        todo.attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${todo.todoId}`
        await todoAccess.attachImageToTodo(todo)
        return await this.getSignedUrl(todo.todoId)
    }
}

function createS3Client() {
    return new XAWS.S3({
        signatureVersion: 'v4'
    })
}



