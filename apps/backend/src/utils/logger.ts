export function logInfo(message: string, meta?: any) {
  console.log(JSON.stringify({
    severity: "INFO",
    message,
    ...meta,
  }));
}

export function logError(message: string, meta?: any) {
  console.error(JSON.stringify({
    severity: "ERROR",
    message,
    ...meta,
  }));
}
