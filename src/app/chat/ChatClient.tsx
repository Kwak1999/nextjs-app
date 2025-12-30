'use client'
// 👉 Next.js App Router에서 클라이언트 컴포넌트임을 명시
// (useState, useSWR, 이벤트 핸들링 사용 가능)

import React, { useEffect, useState } from 'react';
import { User } from "@prisma/client";
import axios from "axios";
import useSWR from "swr";

// 채팅 메시지와 대화 정보까지 포함된 User 타입
import { TUserWithChat } from "@/types";

// 좌측 유저 목록 컴포넌트
import Contacts from "@/app/components/chat/Contacts";

// 우측 채팅 화면 컴포넌트
import Chat from "@/app/components/chat/Chat";

interface ChatClientProps {
    currentUser?: User | null;
    // 👉 로그인한 사용자 (서버에서 내려받은 기본 User 정보)
}

const ChatClient = ({ currentUser }: ChatClientProps) => {

    /**
     * 현재 선택된 채팅 상대 정보
     * Contacts에서 유저를 클릭하면 이 상태가 업데이트됨
     */
    const [receiver, setReceiver] = useState({
        receiverId: "",
        receiverName: "",
        receiverImage: "",
    });

    /**
     * 모바일 화면 레이아웃 제어용 상태
     * false → 유저 목록(Contacts) 표시
     * true  → 채팅 화면(Chat) 표시
     */
    const [layout, setLayout] = useState(false);

    /**
     * SWR에서 사용할 데이터 fetcher 함수
     * /api/chat → 모든 유저 + 대화 정보 반환
     */
    const fetcher = (url: string) =>
        axios.get(url).then((res) => res.data);

    /**
     * SWR을 이용한 실시간 채팅 데이터 요청
     * - refreshInterval: 1000ms → 1초마다 자동 갱신
     */
    const { data: users, error, isLoading } = useSWR(
        '/api/chat',
        fetcher,
        { refreshInterval: 1000 }
    );

    /**
     * 전체 유저 목록(users) 중
     * 로그인한 사용자(currentUser)와 이메일이 같은 유저를 찾음
     * → 메시지, 대화 목록이 포함된 "현재 유저" 객체
     */
    const currentUserWithMessage = users?.find(
        (user: TUserWithChat) => user.email === currentUser?.email
    );

    // 데이터 로딩 상태 처리
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <main>
            {/*
                화면 레이아웃
                - 모바일: 단일 컬럼
                - 데스크탑(md 이상): [유저 목록 | 채팅 화면]
            */}
            <div className='grid grid-cols-[1fr] md:grid-cols-[300px_1fr]'>

                {/* 유저 목록 영역 */}
                <section className={`md:flex ${layout && 'hidden'}`}>
                    <Contacts
                        users={users}                         // 전체 유저 목록
                        currentUser={currentUserWithMessage} // 로그인한 유저
                        setLayout={setLayout}                 // 화면 전환 제어
                        setReceiver={setReceiver}             // 채팅 상대 설정
                    />
                </section>

                {/* 채팅 화면 영역 */}
                <section className={`md:flex ${!layout && 'hidden'}`}>
                    <Chat
                        currentUser={currentUserWithMessage} // 로그인한 유저
                        receiver={receiver}                   // 선택된 채팅 상대
                        setLayout={setLayout}                 // 뒤로가기용
                    />
                </section>

            </div>
        </main>
    );
};

export default ChatClient;
