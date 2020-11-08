export const withEventLog = (handler, lambdaName) => (event, ...args) => {
  console.log(lambdaName, `Event: ${JSON.stringify(event)}`);

  return handler(event, ...args);
};
