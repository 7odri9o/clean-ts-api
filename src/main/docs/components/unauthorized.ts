export const unauthorized = {
  description: 'Não Autorizado',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
