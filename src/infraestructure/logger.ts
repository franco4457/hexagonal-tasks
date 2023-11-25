export const loggerRequest = (method: string, path: string): void => {
  console.log(
    '\x1b[90m',
    'Request received: ',
    '\x1b[36m',
    method.padEnd(8).toUpperCase(),
    '\x1b[95m',
    path,
    '\x1b[0m'
  )
}
