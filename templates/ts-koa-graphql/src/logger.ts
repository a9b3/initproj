import { createLogger, format, transports } from 'winston'

export default createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  level: 'info',
  transports: [new transports.Console()],
})
