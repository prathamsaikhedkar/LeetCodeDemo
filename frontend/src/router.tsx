import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { RootLayout } from './components/layout/RootLayout'
import { HomePage } from './pages/HomePage'
import { ProblemsPage } from './pages/ProblemsPage'
import { ProblemSolverPage } from './pages/ProblemSolverPage'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const problemsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/problems',
  component: ProblemsPage,
})

const problemSolverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/problems/$problemId',
  component: ProblemSolverPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  problemsRoute,
  problemSolverRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

