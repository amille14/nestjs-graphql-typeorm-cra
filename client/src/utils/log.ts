export const logInfo = (output: string, ...rest: any[]) => {
  console.info(`%c[${output}]`, 'color: lightskyblue;', ...rest)
}

export const logSuccess = (output: string, ...rest: any[]) => {
  console.info(`%c[${output}]`, 'color: lightgreen;', ...rest)
}

export const logFailure = (output: string, ...rest: any[]) => {
  console.info(`%c[${output}]`, 'color: indianred;', ...rest)
}
