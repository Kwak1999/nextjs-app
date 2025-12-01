import prisma from '@/helpers/prismadb';
import { PrismaAdapter } from "@auth/prisma-adapter"; // ✅ 최신 패키지명
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";


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
                username: { label: "Username", type: "text"},
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                if(!credentials?.email || !credentials?.password){
                    throw new Error('Invalid credentials');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email:credentials.email
                    }
                })

                if(!user || !user?.hashedPassword){
                    throw new Error('Invalid credentials')
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )
                if(!isCorrectPassword){
                    throw new Error('Invalid credentials');
                }
                return user;
            },
        }),
    ],

    // ✅ 세션 관리 방식
    session: {
        strategy: "jwt", // 또는 'database'
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 30 * 24 * 60 * 60 // 30days
    },
    pages: {
        signIn: '/auth/login',
    },
    // session에 jwt 데이터 넣는 과정
    callbacks: {
        async jwt({token, user}){
            return {...token, ...user};
        },

        async session({session, token})  {
            session.user = token
            return session;
        }
    }
    // // ✅ 보안용 시크릿키
    // secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions)