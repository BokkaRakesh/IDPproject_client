export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  aws: {
    region: 'us-west-2',
    awsAccessKeyId: 'YOUR_PLACEHOLDER_ACCESS_KEY',
    awsSecretAccessKey: 'YOUR_PLACEHOLDER_SECRET_KEY',
    dynamoDbTableName: '', 
  },
  featureFlags: {
    enableFeatureX: true,
  },
};
