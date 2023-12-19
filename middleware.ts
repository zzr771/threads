// 本文件配置clerk。如哪些页面不需要authentication就能访问，哪些页面需要
import { authMiddleware } from "@clerk/nextjs"

// Docs: https://clerk.com/docs/references/nextjs/auth-middleware#options
export default authMiddleware({
  // A list of routes that should be accessible without authentication.
  publicRoutes: ["/", "/api/webhook/clerk"],
  // A list of routes that should be ignored by the middleware. This list typically includes routes for static files or Next.js internals.
  ignoredRoutes: ["/api/webhook/clerk"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
