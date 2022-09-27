import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import {UpdateTodoResponse} from "../../responses/UpdateTodoResponse";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const todoId = event.pathParameters.todoId
      const updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updateTodoRequest" object - DONE
      const userId = getUserId(event)
      const updatedTodo = await updateTodo(todoId, updateTodoRequest, userId)

      return {
          statusCode: 200,
          body: JSON.stringify({
              item: updatedTodo as UpdateTodoResponse
          })
      }

  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
