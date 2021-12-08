import { apiKeyAuthSchema } from '@/main/docs/schemas'

export const securitySchemes = {
  apiKeyAuth: apiKeyAuthSchema
}

export const security = [{
  apiKeyAuth: []
}]
