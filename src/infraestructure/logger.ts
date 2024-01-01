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

type Color = keyof typeof COOLORS
export class Logger implements LoggerPort {
  private readonly appContext?: string
  private readonly context?: string
  constructor({ context, appContext }: { context?: string; appContext?: string }) {
    this.context = context
    this.appContext = appContext
  }

  private _log(color: Color, type: string, ...message: string[]): void {
    console.log(
      ...this._prefix(color),
      ...this._type(color, type),
      ...this._context(),
      ...this._content(color, ...message)
    )
  }

  private _content(color: Color, ...message: string[]): string[] {
    return [COOLORS[color], ...message, COOLORS.reset]
  }

  private _timeStamp(): string {
    return format.format(new Date())
  }

  private _type(color: Color, type: string): string[] {
    return [COOLORS[color], type.padStart(5).toUpperCase()]
  }

  private _context(): string[] {
    return this.context != null ? [COOLORS.yellow, `[${this.context}]`] : ['']
  }

  private _prefix(color: Color): string[] {
    const appContext = this.appContext != null ? `[${this.appContext}]` : ''
    return [COOLORS[color], appContext + ' -', COOLORS.reset, this._timeStamp(), COOLORS[color]]
  }

  log(message: string, ...meta: unknown[]): void {
    this._log('blue', 'log', message, ...(meta as string[]))
  }

  error(message: string, trace?: unknown, ...meta: unknown[]): void {
    this._log(
      'red',
      'error',
      message,
      ...(meta as string[]),
      trace != null ? ` \n ${String(trace)}` : ''
    )
  }

  warn(message: string, ...meta: unknown[]): void {
    this._log('yellow', 'warn', message, ...(meta as string[]))
  }

  debug(message: string, ...meta: unknown[]): void {
    this._log('magenta', 'debug', message, ...(meta as string[]))
  }
}
