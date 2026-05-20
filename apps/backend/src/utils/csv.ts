function escapeCsvValue(value: string) {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

export function rowsToCsv(rows: Array<Record<string, string>>) {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0] ?? {})
  const headerLine = headers.map(escapeCsvValue).join(',')
  const lines = rows.map((row) => headers.map((h) => escapeCsvValue(row[h] ?? '')).join(','))
  return [headerLine, ...lines].join('\n')
}
