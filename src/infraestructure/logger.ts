import { type LoggerPort } from '@/domain/core'

const COOLORS = {
  reset: '\x1b[0m',
  red: '\x1b[91m',
  green: '\x1b[92m',
  darkYellow: '\x1b[33m',
  yellow: '\x1b[93m',
  blue: '\x1b[94m',
  magenta: '\x1b[95m',
  cyan: '\x1b[96m'
}
const REQUEST_COLORS: Record<string, string> = {
  GET: COOLORS.green,
  POST: COOLORS.blue,
  PUT: COOLORS.darkYellow,
  PATCH: COOLORS.yellow,
  DELETE: COOLORS.red
}

export const loggerRequest = (method: string, path: string): void => {
  const logger = new Logger({ appContext: 'EXPRESS', context: 'HttpRequest' })
  logger.debug(
    'Request received: ',
    REQUEST_COLORS?.[method] ?? COOLORS.reset,
    method.padEnd(8).toUpperCase(),
    COOLORS.cyan,
    path
  )
}

const OPTIONS_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short',
  hour12: false
}

const format = new Intl.DateTimeFormat('es-ES', OPTIONS_FORMAT)

export class Logger implements LoggerPort {
  private readonly appContext?: string
  private readonly context?: string
  constructor({ context, appContext }: { context?: string; appContext?: string }) {
    this.context = context
    this.appContext = appContext
  }

  private _log(color: keyof typeof COOLORS, ...message: string[]): void {
    console.log(...this._prefix(color), ...message, COOLORS.reset)
  }

  private _timeStamp(): string {
    return '- ' + format.format(new Date())
  }

  private _prefix(color: keyof typeof COOLORS): string[] {
    const appContext = this.appContext != null ? `[${this.appContext}]` : ''
    const context = this.context != null ? `[${this.context}]` : ''
    return [COOLORS[color], appContext, COOLORS.reset, this._timeStamp(), COOLORS[color], context]
  }

  log(message: string, ...meta: unknown[]): void {
    this._log('blue', message, ...(meta as string[]))
  }

  error(message: string, trace?: unknown, ...meta: unknown[]): void {
    this._log('red', message, ...(meta as string[]), trace != null ? ` \n ${String(trace)}` : '')
  }

  warn(message: string, ...meta: unknown[]): void {
    this._log('yellow', message, ...(meta as string[]))
  }

  debug(message: string, ...meta: unknown[]): void {
    this._log('magenta', message, ...(meta as string[]))
  }
}
