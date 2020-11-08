export const withEventLog = (handler, lambdaName) => (event, ...args) => {
  console.log(lambdaName, `Event: ${event}`);

  return handler(event, ...args);
};
