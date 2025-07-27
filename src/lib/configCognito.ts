const awsExports = {
    Auth: {
        Cognito: {

            region: 'us-east-1',
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
            userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_WEB_CLIENT_ID,
            mandatorySignIn: true,
        }
    }
};

export default awsExports;