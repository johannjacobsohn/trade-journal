import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Theme } from '@radix-ui/themes'
import { ThemeProvider } from 'next-themes'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import '@radix-ui/themes/styles.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './main.scss'
import reportWebVitals from './reportWebVitals.ts'

import './i18n';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient()

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ThemeProvider attribute="class" defaultTheme='dark'>
        <Theme accentColor="pink" grayColor="slate">
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </Theme>
      </ThemeProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
