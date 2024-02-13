/**
 * The routes which is allowed to access to every user.
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
];

/**
 * The routes which allow user to login/register.
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for authentication pusposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings";