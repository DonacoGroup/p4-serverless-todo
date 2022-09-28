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
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": id,
                },
            }).promise()

            const items = result.Items
            logger.info('Todos for user successfully returned',{
                method:'getTodosForUser',
                userId:id,
                items: items
            })
            return items as Todo[]
        }
        catch (e) {
            logger.error('Todos for user failed',{
                method:'getTodosForUser',
                userId:id,
                error: e
            })
            return []
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
        try{
            await this.docClient.delete({
                TableName: this.todosTable,
                Key: todo
            }).promise()
            logger.info('Todos for user successfully deleted',{
                method:'deleteTodo',
                todo: todo
            })
            return todo
        }
        catch(e) {
            logger.error(`Todos for user failed ${todo}`,{
                method:'deleteTodo',
                todo: todo,
                error: e
            })
            return {} as Todo
        }

    }

    async attachImageToTodo(todo: Todo): Promise<Todo> {
        try{
            await this.docClient.update({
                TableName: this.todosTable,
                Key: {todoId:todo.todoId, userId:todo.userId},
                UpdateExpression: 'set #url = :url',
                ExpressionAttributeNames: {
                    '#url' : 'attachmentUrl',
                },
                ExpressionAttributeValues: {
                    ':url' : todo.attachmentUrl,
                }
            }).promise()
            logger.info(`attachImageToTodo for todo ${todo} succeeded`,{
                method:'attachImageToTodo',
                todo: todo
            })
            return todo
        }
        catch (e) {
            logger.error(`attachImageToTodo for todo ${todo} failed`,{
                method:'attachImageToTodo',
                todo: todo,
                error: e
            })
            return {} as Todo
        }

    }
    async todoExists(todoId: string, userId:string) {
        try{
            logger.info('Todos for user exist? before',{
                method:'todoExists',
                todo: todoId,
                userId: userId,
            })
            const result = await this.docClient
                .get({
                    TableName: this.todosTable,
                    Key: {
                        todoId,
                        userId
                    }
                })
                .promise()
            logger.info('Todos for user exist?',{
                method:'todoExists',
                todo: todoId,
                userId: userId,
                result:!!result.Item
            })
            return !!result.Item
        }
        catch(e){
            logger.error(`Todos for user failed ${todoId} ${userId}`,{
                method:'todoExists',
                todo: todoId,
                userId: userId,
                error: e
            })
            return false
        }

    }
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
}
