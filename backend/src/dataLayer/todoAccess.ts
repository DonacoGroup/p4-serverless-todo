import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TodosTable) {
    }

    async getTodosForUser(id:string): Promise<TodoItem[]> {
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
        return items as TodoItem[]
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