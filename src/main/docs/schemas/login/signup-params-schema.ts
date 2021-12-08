export const signupParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    confirmationPassword: {
      type: 'string'
    }
  },
  required: ['name', 'email', 'password', 'confirmationPassword']
}
