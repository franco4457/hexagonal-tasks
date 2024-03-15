export const JWT_SECRET =
  process.env.NODE_ENV === 'test' ? 'test' : (process.env.JWT_SECRET as string)
