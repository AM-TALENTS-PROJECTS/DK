import 'express-session';

declare module 'express-session' {
  interface SessionData {
    _csrf_token?: string;
  }
}
