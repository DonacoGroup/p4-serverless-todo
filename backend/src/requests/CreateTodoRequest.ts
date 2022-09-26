/**
 * Fields in a request to create a single TODO_ item.
 */
export interface CreateTodoRequest {
  name: string
  dueDate: string,
  done: boolean
  attachmentUrl: string
}
