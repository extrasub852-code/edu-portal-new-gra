import { createRequire } from "node:module";
import type { RequestHandler } from "express";

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const CASAuthentication = require("node-cas-authentication");

/**
 * Georgia Tech CAS SSO configuration.
 * Uses sso.gatech.edu (login.gatech.edu also works).
 * - Login: https://sso.gatech.edu/cas/login
 * - Validate: https://sso.gatech.edu/cas/serviceValidate
 * - Logout: https://sso.gatech.edu/cas/logout
 */
const cas = new CASAuthentication({
  cas_url: "https://sso.gatech.edu/cas",
  service_url: process.env.APP_URL ?? "http://localhost:8080",
  cas_version: "2.0",
  session_name: "cas_user",
  session_info: "cas_userinfo",
  destroy_session: true,
  is_dev_mode: process.env.CAS_DEV_MODE === "true",
  dev_mode_user: process.env.CAS_DEV_USER ?? "",
  dev_mode_info: {},
});

/**
 * Initiate GT SSO login. Redirects to login.gatech.edu.
 * Optional ?returnTo= or ?redirect= query param = where to go after success.
 */
export const login: RequestHandler = (req, res, next) => {
  if (!req.query.returnTo && req.query.redirect) {
    req.query.returnTo = req.query.redirect as string;
  }
  if (!req.query.returnTo) {
    req.query.returnTo = "/";
  }
  (cas as { bounce_redirect: RequestHandler }).bounce_redirect(req, res, next);
};

/**
 * Logout and redirect to GT CAS logout.
 */
export const logout: RequestHandler = (req, res) => {
  (cas as { logout: RequestHandler }).logout(req, res);
};

/**
 * Check auth status. Returns { loggedIn, user } for frontend.
 */
export const me: RequestHandler = (req, res) => {
  const user = req.session?.[cas.session_name as string] as string | undefined;
  const userInfo = req.session?.["cas_userinfo"] as Record<string, unknown> | undefined;
  res.json({
    loggedIn: !!user,
    user: user ?? null,
    userInfo: userInfo ?? null,
  });
};

/**
 * Middleware to protect routes - redirects unauthenticated users to SSO.
 */
export const requireAuth = (cas as { bounce: RequestHandler }).bounce;

/**
 * Middleware to block unauthenticated users with 401.
 */
export const blockUnauth = (cas as { block: RequestHandler }).block;
