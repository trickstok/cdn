export const throwError = (message: string, status: number): Error => {
  const error: any = new Error(message);
  error.status = status;

  return error;
};
