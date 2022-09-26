import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem as Todo } from '../models/TodoItem'
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {getUserId} from "../lambda/utils";
import {APIGatewayProxyEvent} from "aws-lambda";

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
