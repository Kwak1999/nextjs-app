import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

interface Params {
    productId: string; // URL에서 전달되는 상품 ID (예: /api/favorites/123)
}

/*
===========================================================
  ❤️ POST: 좋아요 추가 API
  /api/favorites/[productId] 요청 시 호출됨
===========================================================
*/
export async function POST(request: Request, { params }: { params: Params }) {

    // 1) 로그인한 사용자 정보 가져오기
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        // 비로그인 상태 → 좋아요 불가
        return NextResponse.error();
    }

    const { productId } = params;

    // 2) 상품 ID 유효성 검사
    if (!productId || typeof productId !== "string") {
        throw new Error("Invalid ID");
    }

    // 3) 기존 좋아요 목록을 복사 (favoriteIds는 string[] 형태)
    let favoriteIds = [...(currentUser.favoriteIds || [])];

    // 4) 좋아요 목록에 상품 추가
    favoriteIds.push(productId);

    // 5) DB에서 유저 레코드 업데이트
    const user = await prisma?.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds: favoriteIds
        }
    });

    // 6) 업데이트된 유저 정보 반환
    return NextResponse.json(user);
}

/*
===========================================================
  💔 DELETE: 좋아요 제거 API
  /api/favorites/[productId] DELETE 요청 시 호출됨
===========================================================
*/
export async function DELETE(request: Request, { params }: { params: Params }) {

    // 1) 로그인 사용자 가져오기
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { productId } = params;

    // 2) 상품 ID 검증
    if (!productId || typeof productId !== "string") {
        throw new Error("Invalid ID");
    }

    // 3) 기존 좋아요 목록 복사
    let favoriteIds = [...(currentUser.favoriteIds || [])];

    // 4) 해당 상품 ID를 좋아요 목록에서 제거
    favoriteIds = favoriteIds.filter(id => id !== productId);

    // 5) DB 업데이트
    const user = await prisma?.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds: favoriteIds
        }
    });
    // 6) 변경된 유저 정보 반환
    return NextResponse.json(user);
}
