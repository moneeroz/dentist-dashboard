import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session.user type from NextAuth.js
   * This is useful for when you're adding custom properties like `role`
   */
  interface User {
    role?: 'admin' | 'user';
  }

  /**
   * Extends the Session interface to include the user type extended above
   */
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the JWT interface from NextAuth.js to include custom properties
   */
  interface JWT {
    role?: 'admin' | 'user';
  }
}
