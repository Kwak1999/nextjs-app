import getCurrentUser from "@/app/actions/getCurrentUser";
import {NextResponse} from "next/server";
import prisma from "@/helpers/prismadb"

export async function GET(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    /*
     * - 기존: 전체 유저 + 전체 대화 조회 → 응답 데이터 과다
     * - 변경: currentUser가 참여한 대화만 조회 후, 프론트엔드 형식(User[])으로 변환
     */

    // 1) currentUser가 참여한 대화만 조회 (전체 유저 조회 제거)
    const conversations = await prisma.conversation.findMany({
        where: {
            users: {
                some: { id: currentUser.id },
            },
        },
        include: {
            users: true,
            messages: {
                include: {
                    sender: true,
                    receiver: true,
                },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // 2) conversations → users 배열로 변환 (ChatClient, Contacts가 기대하는 형식)
    // - currentUserWithConvs: 현재 유저 + 전체 대화 목록 (Chat 컴포넌트에서 메시지 표시용)
    const currentUserWithConvs = {
        ...currentUser,
        conversations,
    };

    // 3) 대화 상대별로 그룹화 (한 유저와 여러 대화 가능하므로 Map 사용)
    const otherUsersMap = new Map<string, { user: typeof currentUser; conversations: typeof conversations }>();

    for (const conv of conversations) {
        const otherUser = conv.users.find((u) => u.id !== currentUser.id);
        if (!otherUser) continue;

        if (otherUsersMap.has(otherUser.id)) {
            otherUsersMap.get(otherUser.id)!.conversations.push(conv);
        } else {
            otherUsersMap.set(otherUser.id, {
                user: otherUser,
                conversations: [conv],
            });
        }
    }

    // 4) 상대 유저들도 { user, conversations } 형식으로 변환
    const otherUsersWithConvs = Array.from(otherUsersMap.values()).map(({ user, conversations }) => ({
        ...user,
        conversations,
    }));

    // 5) [currentUser, 상대1, 상대2, ...] 형태로 합쳐 반환
    const users = [currentUserWithConvs, ...otherUsersWithConvs];

    return NextResponse.json(users);
}


export async function POST(
    request: Request
){
    const currentUser = await getCurrentUser();

    if(!currentUser){
        return NextResponse.error();
    }

    const body = await request.json();

    const conversation = await prisma.conversation.findFirst({
        where: {
            AND: [
                {
                    users:{
                        some:{
                            id:body.senderId
                        }
                    }
                },
                {
                    users:{
                        some:{
                            id:body.receiverId
                        }
                    }
                }
            ]
        }
    })

    if(conversation){
        // 대화를 했다면 메세지만 생성
        try{
            const message = await prisma.message.create({
                data:{
                    text: body.text,
                    image: body.image,
                    senderId: body.senderId,
                    receiverId: body.receiverId,
                    conversationId: conversation.id
                }
            })

            return NextResponse.json(message)
        } catch(error){
            return NextResponse.error();
        }

    }else{
        // 처음 대화하는거라면 conversation과 message 둘 다 생성
        const newConversation = await prisma.conversation.create({
            data:{
                senderId: body.senderId,
                receiverId: body.receiverId,
                users: {
                    connect: [
                        {
                            id: body.senderId,
                        },
                        {
                            id: body.receiverId,
                        }
                    ]
                }
            }
        })

        try{
            const message = await prisma.message.create({
                data:{
                    text: body.text,
                    image: body.image,
                    senderId: body.senderId,
                    receiverId: body.receiverId,
                    conversationId: newConversation.id
                }
            })

            return NextResponse.json(message)
        } catch(error){
            return NextResponse.error();
        }

    }
}