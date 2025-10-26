import {DefaultSession} from "next-auth";

// 오토 컴플릿

declare module "next-auth"{
    interface Session {
        user?: {
            id?: string;
            role?: string;
        } & DefaultSession["user"];
    }
}