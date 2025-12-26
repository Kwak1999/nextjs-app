import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb"; // ✅ 너 프로젝트에서 prisma 경로 맞춰서 사용

/*
===========================================================
  ❤️ POST: 좋아요 추가 API
  /api/favorites/[productId]
===========================================================
*/
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> } // ✅ Next 15 타입에 맞춤
) {
    // ✅ params는 Promise라서 await 필요
    const { productId } = await params;

    // 1) 로그인한 사용자 정보 가져오기
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // 2) 상품 ID 유효성 검사
    if (!productId || typeof productId !== "string") {
        throw new Error("Invalid ID");
    }

    // 3) 기존 좋아요 목록 복사
    const favoriteIds = [...(currentUser.favoriteIds || [])];

    // 4) 좋아요 목록에 상품 추가 (중복 방지까지 하고 싶으면 아래 주석 참고)
    favoriteIds.push(productId);
    // if (!favoriteIds.includes(productId)) favoriteIds.push(productId);

    // 5) DB 업데이트
    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: { favoriteIds },
    });

    // 6) 업데이트된 유저 정보 반환
    return NextResponse.json(user);
}

/*
===========================================================
  💔 DELETE: 좋아요 제거 API
  /api/favorites/[productId]
===========================================================
*/
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> } // ✅ Next 15 타입에 맞춤
) {
    const { productId } = await params;

    // 1) 로그인 사용자 가져오기
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // 2) 상품 ID 검증
    if (!productId || typeof productId !== "string") {
        throw new Error("Invalid ID");
    }

    // 3) 기존 좋아요 목록 복사 → 해당 ID 제거
    const favoriteIds = (currentUser.favoriteIds || []).filter(
        (id) => id !== productId
    );

    // 4) DB 업데이트
    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: { favoriteIds },
    });

    // 5) 변경된 유저 정보 반환
    return NextResponse.json(user);
}