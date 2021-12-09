export const requestBody = (schema: string): any => {
  return {
    requestBody: {
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
