import React, { useState } from 'react';
import { TUserWithChat } from "@/types";
import User from './User';
import { HiOutlineSearch } from 'react-icons/hi';

interface ContactsProps {
    users: TUserWithChat[];
    currentUser?: TUserWithChat | null;
    setLayout: (layout: boolean) => void;
    setReceiver: (receiver: { receiverId: string; receiverName: string; receiverImage: string }) => void;
}

const Contacts = ({ users, currentUser, setLayout, setReceiver }: ContactsProps) => {
    const [search, setSearch] = useState('');

    const filteredUsers = users
        .filter((user) => user.id !== currentUser?.id)
        .filter((user) => {
            if (!search.trim()) return true;
            const name = (user.name || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const term = search.toLowerCase();
            return name.includes(term) || email.includes(term);
        });

    const handleSelectUser = (userId: string, userName: string | null, userImage: string | null) => {
        setReceiver({
            receiverId: userId,
            receiverName: userName || "",
            receiverImage: userImage || ""
        });
        setLayout(true);
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 md:max-w-[320px]">
            {/* 헤더 */}
            <div className="p-4 border-b border-slate-100 shrink-0">
                <h1 className="text-xl font-bold text-slate-800 mb-4">채팅</h1>
                <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="대화 검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* 대화 목록 */}
            <div className="flex-1 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <span className="text-3xl">💬</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            {search ? '검색 결과가 없어요.' : '아직 대화가 없어요.'}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="mt-2 text-sm text-teal-600 hover:text-teal-700"
                            >
                                검색 초기화
                            </button>
                        )}
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => handleSelectUser(user.id, user.name, user.image)}
                        >
                            <User user={user} currentUserId={currentUser?.id || ''} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Contacts;