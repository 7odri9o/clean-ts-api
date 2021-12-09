export const ok = (schema: string): any => {
  return {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            $ref: `#/schemas/${schema}`
          }
        }
      }
    }
  }
}
