import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem as Todo} from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import {getSignedUrl} from "./attachmentUtils";

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic - DONE

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        ) {
    }

    async getTodosForUser(id:string): Promise<Todo[]> {
        console.log('Getting all todos for current user')

        const result = await this.docClient.scan({
            TableName: this.todosTable,
            FilterExpression:
                "contains(userId, :userId)",
            ExpressionAttributeValues: {
                ":userId": id,
            },
        }).promise()

        const items = result.Items
        return items as Todo[]
    }

    async createTodo(todo: Todo): Promise<Todo> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async updateTodo(todo: Todo): Promise<Todo> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo as TodoUpdate
        }).promise()

        return todo
    }

    async deleteTodo(todo: Todo): Promise<Todo> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: todo
        }).promise()

        return todo
    }

    async attachImageToTodo(todo: Todo): Promise<Todo> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async createAttachmentUrl(id: string) {
        await this.attachImageToTodo({todoId:id, attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${id}`} as Todo)
        return await getSignedUrl(id)
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
