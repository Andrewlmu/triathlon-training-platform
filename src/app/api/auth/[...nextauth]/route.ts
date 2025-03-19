import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Change from default export to named exports
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };