import React from 'react';
import { TUserWithChat } from '@/types';
import Avatar from '../Avatar';
import { fromNow } from '@/helpers/dayjs';

interface UserProps {
    user: TUserWithChat;
    currentUserId: string;
}

const User = ({ user, currentUserId }: UserProps) => {
    const conversationList = (user as any)?.conversations ?? (user as any)?.conversation ?? [];
    const messagesWithCurrentUser = conversationList.find(
        (conversation: any) => conversation.users?.some((u: any) => u.id === currentUserId)
    );
    const latestMessage = messagesWithCurrentUser?.messages?.slice(-1)[0];

    const previewText = latestMessage
        ? latestMessage.image
            ? '[이미지]'
            : (latestMessage.text || '').slice(0, 40) + ((latestMessage.text || '').length > 40 ? '...' : '')
        : null;

    return (
        <div className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0">
            <div className="shrink-0">
                <Avatar src={user.image} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-slate-800 truncate">{user.name || '알 수 없음'}</h3>
                    {latestMessage && (
                        <span className="text-xs text-slate-400 shrink-0">
                            {fromNow(latestMessage.createdAt)}
                        </span>
                    )}
                </div>
                {previewText && (
                    <p className="text-sm text-slate-500 truncate mt-0.5">{previewText}</p>
                )}
            </div>
        </div>
    );
};

export default User;