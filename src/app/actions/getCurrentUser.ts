import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";


// ✅ 현재 세션 정보 가져오기 (NextAuth 서버 세션)
export async function getSession() {
    return await getServerSession(authOptions);
}

// ✅ 로그인된 사용자 정보 가져오기
export default async function getCurrentUser() {
    try {
        // 1️⃣ 현재 세션 가져오기
        const session = await getSession();

        // 2️⃣ 세션에 이메일 정보가 없으면 (비로그인 상태)
        if (!session?.user?.email) {
            return null;
        }

        // 3️⃣ Prisma로 이메일 기반 사용자 조회
        const currentUser = await prisma?.user.findUnique({
            where: { email: session.user.email },
        });

        // 4️⃣ 유저 정보가 없을 경우 null 반환
        if (!currentUser) {
            return null;
        }

        // 5️⃣ 유저 정보 반환
        return currentUser;
    } catch (error) {
        // ❌ 에러 발생 시 null 반환
        return null;
    }
}
