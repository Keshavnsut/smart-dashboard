export function getErrorMessage(err: unknown) {
  if (err instanceof Error) {
    return err.message
  }
  return 'Something went wrong'
}
