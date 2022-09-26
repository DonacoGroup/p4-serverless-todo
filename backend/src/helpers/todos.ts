import { TodoAccess } from './todoAccess'
import { AttachmentUtils } from './attachmentUtils';
import {TodoItem as Todo} from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import {APIGatewayProxyEvent} from "aws-lambda";
import {getUserId} from "../lambda/utils";

// TODO: Implement businessLogic - DONE
const todoAccess = new TodoAccess()

export async function getTodosForUser(id:string): Promise<Todo[]> {
    return todoAccess.getTodosForUser(id)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    event: APIGatewayProxyEvent
): Promise<Todo> {

    const todoId = uuid.v4()
    const userId = getUserId(event)

    return await todoAccess.createTodo({
        todoId: todoId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: createTodoRequest.done,
        attachmentUrl: createTodoRequest.attachmentUrl,
        createdAt: new Date().toISOString()
    })
}

export async function updateTodo(
    id:string,
    updateTodoRequest: UpdateTodoRequest,
    userId:string
): Promise<Todo> {

    return await todoAccess.updateTodo({
        todoId: id,
        userId: userId,
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done,
    } as Todo)
}

export async function deleteTodo(id:string): Promise<Todo> {

    return await todoAccess.deleteTodo({
        todoId: id,
    } as Todo)
}

export async function createAttachmentPresignedUrl(id:string) {
    return await todoAccess.createAttachmentUrl(id)
}
