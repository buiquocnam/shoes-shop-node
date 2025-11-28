// Public routes that don't require authentication
export const publicRoutes = ["/auth/login", "/auth/register", "/auth/health"];

// Check if a route is public
export const isPublicRoute = (path: string): boolean => {
  // Health check shouldn't require authentication regardless of publicRoutes
  if (path === "/health") {
    return true;
  }

  return publicRoutes.some((route) => path.startsWith(route));
};
