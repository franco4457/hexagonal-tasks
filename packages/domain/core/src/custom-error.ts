import { z } from 'zod'

export const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  /*
    This is where you override the various error codes
    */
  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      if (error.received === 'undefined') {
        return { message: ctx.defaultError }
      }
      return {
        message: `Invalid type on '${error.path.reduce((acc, curr) => {
          if (acc === '') return curr
          return !isNaN(Number(curr)) ? `${acc}[${curr}]` : `${acc}.${curr}`
        }, '')}'. expected ${error.expected}, received ${error.received}`
      }
    default:
      return { message: ctx.defaultError }
  }

  // fall back to default message!
}
