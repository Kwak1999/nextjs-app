'use client';

import React, { useState } from 'react';
import { User } from "@prisma/client";
import axios from "axios";
import useSWR from "swr";
import { TUserWithChat } from "@/types";
import Contacts from "@/app/components/chat/Contacts";
import Chat from "@/app/components/chat/Chat";

interface ChatClientProps {
    currentUser?: User | null;
}

const ChatClient = ({ currentUser }: ChatClientProps) => {
    const [receiver, setReceiver] = useState({
        receiverId: "",
        receiverName: "",
        receiverImage: "",
    });
    const [layout, setLayout] = useState(false);

    const fetcher = (url: string) => axios.get(url).then((res) => res.data);
    const { data: users, error, isLoading } = useSWR('/api/chat', fetcher, { refreshInterval: 1000 });

    const currentUserWithMessage = users?.find(
        (user: TUserWithChat) => user.email === currentUser?.email
    );

    // 로딩 스켈레톤
    if (isLoading) {
        return (
            <main className="h-[calc(100vh-64px)] bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-full">
                    <div className="hidden md:block p-4 bg-white border-r border-slate-200">
                        <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse mb-6" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex gap-3 p-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2" />
                                        <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse mb-4" />
                        <p className="text-sm">불러오는 중...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
                <div className="text-center p-8">
                    <p className="text-slate-600 mb-4">채팅을 불러오는 데 실패했어요.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="h-[calc(100vh-64px)] bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-full max-h-[calc(100vh-64px)]">
                <section className={`flex flex-col h-full ${layout ? 'hidden md:flex' : 'flex'}`}>
                    <Contacts
                        users={users || []}
                        currentUser={currentUserWithMessage}
                        setLayout={setLayout}
                        setReceiver={setReceiver}
                    />
                </section>
                <section className={`flex flex-col h-full ${!layout ? 'hidden md:flex' : 'flex'}`}>
                    <Chat
                        currentUser={currentUserWithMessage}
                        receiver={receiver}
                        setLayout={setLayout}
                    />
                </section>
            </div>
        </main>
    );
};

export default ChatClient;
