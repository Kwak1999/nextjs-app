import { PrismaClient } from "@/generated/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"; // ✅ 최신 패키지명
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";


const prisma = new PrismaClient();


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        // ✅ 일반 계정 로그인 (예: username/password)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // 예시 사용자 (실제 DB 검증 로직으로 교체 가능)
                const user = { id: "1", name: "J Smith", email: "exam@gmail.com" };

                if (user) {
                    return user; // 로그인 성공
                } else {
                    return null; // 로그인 실패
                }
            },
        }),
    ],

    // ✅ 세션 관리 방식
    session: {
        strategy: "jwt", // 또는 'database'
    },

    // ✅ 보안용 시크릿키
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions)