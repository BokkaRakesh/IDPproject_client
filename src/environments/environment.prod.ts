export const environment = {
    production: true,
    apiUrl: 'http://idp.roche.com/api',
    aws: {
      region: 'us-west-2',
      dynamoDbTableName: 'StudiesTable',
    },
    featureFlags: {
      enableFeatureX: true,
    },
};