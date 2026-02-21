import React, { useEffect, useRef } from 'react';
import { TUserWithChat } from "@/types";
import Input from "@/app/components/chat/Input";
import ChatHeader from "@/app/components/chat/ChatHeader";
import Message from "@/app/components/chat/Message";
import type { Message as PrismaMessage } from "@prisma/client";

interface ChatProps {
    currentUser?: TUserWithChat | null;
    receiver: { receiverId: string; receiverName: string; receiverImage: string };
    setLayout: (layout: boolean) => void;
}

const Chat = ({ currentUser, receiver, setLayout }: ChatProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    });

    const conversationList = (currentUser as any)?.conversations ?? (currentUser as any)?.conversation ?? [];
    const conversation = conversationList.find((c: any) =>
        c.users?.some((u: any) => u.id === receiver.receiverId)
    );
    const messages: PrismaMessage[] = ((conversation as any)?.messages ?? (conversation as any)?.message ?? []) as PrismaMessage[];

    // 데스크탑: 대화 선택 전 빈 화면
    if (!receiver.receiverName || !receiver.receiverId) {
        return (
            <div className="hidden md:flex flex-col flex-1 items-center justify-center bg-slate-100/50">
                <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">💬</span>
                    </div>
                    <p className="text-slate-600 font-medium">대화를 선택해 주세요</p>
                    <p className="text-slate-400 text-sm mt-1">좌측 목록에서 대화 상대를 선택하면 채팅이 시작됩니다.</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return null;
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            <ChatHeader
                setLayout={setLayout}
                receiverName={receiver.receiverName}
                receiverImage={receiver.receiverImage}
            />
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/80 flex flex-col gap-4">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-slate-500 text-sm mb-2">아직 메시지가 없어요.</p>
                        <p className="text-slate-400 text-xs">대화를 시작해 보세요!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg: PrismaMessage) => (
                            <Message
                                key={msg.id}
                                isSender={msg.senderId === currentUser.id}
                                messageText={msg.text}
                                messageImage={msg.image}
                                receiverName={receiver.receiverName}
                                receiverImage={receiver.receiverImage}
                                senderImage={currentUser?.image}
                                time={msg.createdAt}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                <Input receiverId={receiver.receiverId} currentUserId={currentUser.id} />
            </div>
        </div>
    );
};

export default Chat;
