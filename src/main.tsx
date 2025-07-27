import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router'
import { router } from './routes/router.tsx'
import { Amplify } from 'aws-amplify'
import AuthProvider from './context/AuthProvider.tsx'
import "aws-amplify/auth/enable-oauth-listener"

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
			userPoolClientId: import.meta.env.VITE_COGNITO_CLIENTE_ID,
			loginWith: {
				oauth: {
					domain: import.meta.env.VITE_COGNITO_DOMAIN,
					scopes: ['openid', 'email', 'profile', 'phone'],
					redirectSignIn: [import.meta.env.VITE_URL + '/'],
					redirectSignOut: [import.meta.env.VITE_URL + '/auth/login'],
					responseType: 'code',
					//providers: ["Google"]
				}
			},
			signUpVerificationMethod: "code",
		},
	}
})
createRoot(document.getElementById('root')!).render(
	//<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	//</StrictMode >
)
