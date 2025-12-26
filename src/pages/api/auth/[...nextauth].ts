import prisma from '@/helpers/prismadb';
import { PrismaAdapter } from "@auth/prisma-adapter"; // ✅ 최신 패키지명
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as any),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        // ✅ 일반 계정 로그인 (예: username/password)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
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

                // ❌ 기존 코드 문제 2) Prisma user 객체를 통째로 return
                // - user에는 hashedPassword 같은 민감 정보가 포함됨
                // - 아래 jwt 콜백에서 {...token, ...user}로 합쳐버리면
                //   hashedPassword가 JWT/세션에 그대로 들어갈 수 있음(보안 위험)
                //
                // ✅ 개선: return user 대신 "필요한 필드만" 반환
                // return {
                //   id: user.id,
                //   email: user.email,
                //   name: user.name,
                //   image: user.image,
                //   role: user.userType, // (또는 userType 그대로)
                // };
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.userType, // ✅ Admin / User
                };
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
            // ❌ 기존 코드 문제 4) {...token, ...user} 로 전부 합치기
            // - user 객체(민감 필드 포함)가 JWT에 들어갈 수 있음
            // - token 크기가 커지고 예측 불가능해짐
            // - "role" 같은 필드가 없으면 미들웨어에서 계속 undefined가 나옴
            //
            // ✅ 개선: 로그인 시점에만 필요한 값만 token에 명시적으로 넣기
            // if (user) {
            //   token.id = (user as any).id;
            //   token.role = (user as any).role;       // role 유지하려면
            //   // 또는 token.userType = (user as any).userType;
            // }
            // return token;

            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role; // ✅ role 저장
            }
            return token;
        },

        async session({ session, token }) {
            // ❌ 기존 코드 문제 5) session.user = token 으로 통째로 넣기
            // - token에 들어간 모든 필드가 session.user로 노출됨
            // - 클라이언트에서도 이 값들을 접근 가능 → 민감 데이터 노출 위험
            //
            // ✅ 개선: session에는 필요한 정보만 최소로 넣기
            // (session.user as any).id = token.id;
            // (session as any).role = (token as any).role; // 미들웨어가 session.role을 본다면 최상위에 넣기
            // return session;

            session.user = {
                id: token.id as string,
                email: session.user?.email,
                name: session.user?.name,
                image: session.user?.image,
            } as any;

            // ✅ 미들웨어에서 바로 쓰도록 최상위에 role
            (session as any).role = (token as any).role;

            return session;
        },
    }
    }

export default NextAuth(authOptions)