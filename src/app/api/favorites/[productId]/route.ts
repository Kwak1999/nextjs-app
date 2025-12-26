import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/helpers/prismadb";
import { NextRequest, NextResponse } from "next/server";

/*
===========================================================
  ❤️ POST: 좋아요 추가 API
  /api/favorites/[productId]
===========================================================
*/
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    const { productId } = await params;

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }

    if (!productId || typeof productId !== "string") {
        throw new Error("Invalid ID");
    }

    const favoriteIds = [...(currentUser.favoriteIds || [])];
    favoriteIds.push(productId);

    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: { favoriteIds },
    });

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
    { params }: { params: Promise<{ productId: string }> }
) {
    const { productId } = await params;

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }

    if (!productId || typeof productId !== "string") {
        throw new Error("Invalid ID");
    }

    const favoriteIds = (currentUser.favoriteIds || []).filter(
        (id) => id !== productId
    );

    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: { favoriteIds },
    });

    return NextResponse.json(user);
}
