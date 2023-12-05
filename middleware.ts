import { withAuth } from "next-auth/middleware";


export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      console.log("req", req);
      console.log("token", token);
      
      if ((req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin") ) && token === null) {
        return false;
      }
      return true;
    },
  },
});
