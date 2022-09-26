import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem as Todo } from '../models/TodoItem'
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {getUserId} from "../lambda/utils";
import {APIGatewayProxyEvent} from "aws-lambda";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";

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