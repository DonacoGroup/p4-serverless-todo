import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem as Todo} from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic - DONE

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX,
        ) {
    }

    async getTodosForUser(id:string): Promise<Todo[]> {

        try{
            const result = await this.docClient.query({
                TableName: this.todosTable,
                IndexName: this.createdAtIndex,
                KeyConditionExpression: "partionKey , :userId",
                ExpressionAttributeValues: {
                    ":userId": id,
                },
            }).promise()

            const items = result.Items
            logger.info('Todos for user successfully returned',{
                method:'getTodosForUser',
                userId:id
            })
            return items as Todo[]
        }
        catch (e) {

        }
        
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
    async todoExists(todoId: string) {
        const result = await this.docClient
            .get({
                TableName: this.todosTable,
                Key: {
                    id: todoId
                }
            })
            .promise()

        return !!result.Item
    }
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
}
