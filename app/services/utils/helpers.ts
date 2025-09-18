import env from '#start/env'
import moment from 'moment'
import { FilterType, PaginationData } from '#contracts/types/filter_types'
import { DateTime } from 'luxon'
import { LogLevel } from '#contracts/types/static_types'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export function validateEmail(email: string): boolean {
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return false
  }
  const parts = email.split('@').filter((e) => e.trim())
  if (parts.length != 2) {
    return false
  }
  if (parts[1].split('.').filter((e) => e.trim()).length < 2) {
    return false
  }
  return true
}

export function normalizePath(filePath: string, disk: 's3' | 'fs' = 's3') {
  return disk == 's3'
    ? `${env.get('S3_BASE_URL')}${filePath}`
    : `${env.get('APP_URL', '')}/${filePath}`
}

export function parseDate(date: any) {
  if (['', '', null, undefined, NaN].includes(date)) {
    return null
  }
  const parsed = moment(date)
  if (parsed.isValid()) {
    const year = parseInt(parsed.format('YYYY'))
    const nowYear = parseInt(moment().format('YYYY'))
    if (year >= 1990 && year <= nowYear) {
      return parsed
    }
    return null
  } else {
    return null
  }
}

export function castByType(value: any, castType: FilterType): any | null {
  switch (castType) {
    case FilterType.STRING:
      return value ? value.toString().trim() : null
    case FilterType.NUMBER:
      const newValue = parseInt(value)
      return isNaN(newValue) ? null : newValue
    case FilterType.BOOL:
      return value ? checkStringBool(value) : null
    case FilterType.ARRAY:
      return checkDataIsArray(value)
    default:
      return null
  }
}

export function checkDataIsArray(value: any) {
  if (!Array.isArray(value)) {
    const values = value?.toString()?.split(',')
    if (values?.[0]) {
      value = values
    }
  }
  if (!Array.isArray(value)) {
    return null
  }
  const filtered = value.filter(
    (el) =>
      ['string', 'number', 'boolean'].includes(typeof el) && !['', null, undefined, ''].includes(el)
  )
  return filtered.length > 0 ? filtered : null
}

export function checkStringBool(value: string) {
  if (value === 'true') {
    return true
  } else if (value == 'false') {
    return false
  } else {
    return null
  }
}

export function getPaginationData(query: any): PaginationData | boolean {
  const perPage = normalizePaginationNumber(query.perPage)
  const page = normalizePaginationNumber(query.page)
  if (!page || !perPage) {
    return false
  }
  return {
    page,
    perPage,
  } as PaginationData
}

function normalizePaginationNumber(num: any) {
  num = Number(num)
  if (isNaN(num) || num < 1) {
    return false
  }
  return Math.abs(num)
}

export function phoneRegex() {
  return new RegExp('\\+994(55|50|51|70|77|99|10)([0-9]{7})')
}

function formatLog(level: LogLevel, data: any) {
  return JSON.stringify(
    {
      ...data,
      level,
      timestamp: DateTime.now().toISO(),
    },
    null,
    2
  )
}

function baseLog(level: LogLevel, data: any) {
  const formatted = formatLog(level, data)
  console[level](JSON.stringify(formatted))
}

export const logger: Record<LogLevel, (data: any) => void> = {
  [LogLevel.INFO]: (data) => baseLog(LogLevel.INFO, data),
  [LogLevel.WARN]: (data) => baseLog(LogLevel.WARN, data),
  [LogLevel.ERROR]: (data) => baseLog(LogLevel.ERROR, data),
  [LogLevel.DEBUG]: (data) => baseLog(LogLevel.DEBUG, data),
}

export function getBasePrefix(ctx: HttpContext) {
  const parts = ctx.request.url().split('/')
  return parts[3]
}

export function createLogResponse(ctx: HttpContext) {
  const data = ctx.response.lazyBody?.content?.[0]
  let logLevel: LogLevel = LogLevel.INFO
  const statusCode = ctx.response.response.statusCode
  let log: Record<string, any> = logData(ctx)
  log.statusCode = statusCode
  log.method = ctx.request.method()

  if (statusCode >= 400) {
    log.logLevel = LogLevel.ERROR
    log.error = data?.message || data?.errors?.[0]?.message || 'Unknown error'
    logLevel = LogLevel.ERROR
  }

  logger[logLevel](log)
}

export function createLogRequest(ctx: HttpContext) {
  let logLevel: LogLevel = LogLevel.INFO
  let log: Record<string, any> = logData(ctx)
  if (!ctx.request.url().includes('user') && !ctx.request.url().includes('payable-vehicles')) {
    log.body = ctx.request.body()
  }

  log.actionType = 'request'
  logger[logLevel](log)
}

export const logData = (ctx: HttpContext) => {
  const service = getBasePrefix(ctx)

  let log: Record<string, any> = {
    method: ctx.request.method(),
    url: ctx.request.url(),
    ip: ctx.request.ip(),
    user: {
      fullName: ctx.fullName,
      userId: ctx.userId,
    },
    service,
    logLevel: LogLevel.INFO,
    userAgent: ctx.request.headers()['user-agent'],
    actionType: 'response',
  }
  return log
}

export function crud({ controller, prefix }: { controller: any; prefix: string }) {
  router
    .group(() => {
      router.get('/', [controller, 'list'])
      router.post('/', [controller, 'create'])
      router.get('/:id', [controller, 'detail'])
      router.put('/:id', [controller, 'update'])
      router.delete('/:id', [controller, 'remove'])
    })
    .prefix(prefix)
}
