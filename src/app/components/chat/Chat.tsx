import React, { useEffect, useRef } from 'react';
import { TUserWithChat } from "@/types";
import Input from "@/app/components/chat/Input";
import ChatHeader from "@/app/components/chat/ChatHeader";
import Message from "@/app/components/chat/Message";
import type { Message as PrismaMessage } from "@prisma/client"; // ✅ 추가

interface ChatProps {
    currentUser: TUserWithChat;
    receiver: {
        receiverId: string;
        receiverName: string;
        receiverImage: string;
    };
    setLayout: (layout: boolean) => void;
}

const Chat = ({ currentUser, receiver, setLayout }: ChatProps) => {
    const messagesEnRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEnRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    });

    // ✅ conversations(복수)든 conversation(단수)든 배열로 통일해서 처리
    const conversationList =
        (currentUser as any)?.conversations ??
        (currentUser as any)?.conversation ??
        [];

    const conversation = conversationList.find((conversation: any) =>
        conversation.users?.some((user: any) => user.id === receiver.receiverId)
    );

    // ✅ messages / message 둘 다 지원 + 타입 지정 (핵심)
    const messages: PrismaMessage[] =
        ((conversation as any)?.messages ??
            (conversation as any)?.message ??
            []) as PrismaMessage[];

    // ✅ lastMessageTime도 변수로 빼서 JSX에서 깔끔하게
    const lastMessageTime = messages
        .filter((m: PrismaMessage) => m.receiverId === currentUser.id)
        .slice(-1)[0]?.createdAt;

    if (!receiver.receiverName || !currentUser) {
        return <div className='w-full h-full'></div>;
    }

    return (
        <div className='w-full'>
            <div>
                <ChatHeader
                    setLayout={setLayout}
                    receiverName={receiver.receiverName}
                    receiverImage={receiver.receiverImage}
                    lastMessageTime={lastMessageTime}
                />
            </div>

            <div className='flex flex-col gap-8 p-4 overflow-hidden h-[calc(100vh_-_60px_-_70px_-_80px)]'>
                {messages.map((message: PrismaMessage) => (
                    <Message
                        key={message.id}
                        isSender={message.senderId === currentUser.id}
                        messageText={message.text}
                        messageImage={message.image}
                        receiverName={receiver.receiverName}
                        receiverImage={receiver.receiverImage}
                        senderImage={currentUser?.image}
                        time={message.createdAt}
                    />
                ))}
                <div ref={messagesEnRef} />
            </div>

            <div>
                <Input receiverId={receiver?.receiverId} currentUserId={currentUser?.id} />
            </div>
        </div>
    );
};

export default Chat;
