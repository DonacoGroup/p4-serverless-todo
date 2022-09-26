import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createTodo } from '../../businessLogic/todos'
import {CreateTodoResponse} from "../../responses/CreateTodoResponse";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      // TODO: Implement creating a new TODO item - DONE
      const createdTodo = await createTodo(newTodo, event)
      return {
          statusCode: 201,
          body: JSON.stringify({
              item: createdTodo as CreateTodoResponse
          })
      }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
