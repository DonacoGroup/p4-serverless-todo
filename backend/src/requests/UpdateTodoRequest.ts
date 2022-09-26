/**
 * Fields in a request to update a single TODO_ item.
 */
export interface UpdateTodoRequest {
  name: string
  dueDate: string
  done: boolean
}