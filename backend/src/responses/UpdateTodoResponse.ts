/**
 * Fields in a request to create a single TODO_ item.
 */
export interface UpdateTodoResponse {
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl: string
}
