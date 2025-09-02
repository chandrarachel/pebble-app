import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID || 'us-east-1_example',
      userPoolClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID || 'example-client-id',
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool',
    },
  },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;