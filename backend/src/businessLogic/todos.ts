
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem as Todo } from '../models/TodoItem'

const todoAccess = new TodoAccess()

export async function getTodosForUser(id:string): Promise<Todo[]> {
    return todoAccess.getTodosForUser(id)
}
