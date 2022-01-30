import 'module-alias/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda'

export const handler: Handler = async (
	event: APIGatewayProxyEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Find Slots By Date Lambda!!! ;)'
    })
  }
}

