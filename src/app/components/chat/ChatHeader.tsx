import React from 'react';
import { HiOutlineArrowLeft } from "react-icons/hi";
import Avatar from "@/app/components/Avatar";

interface ChatHeaderProps {
    setLayout: (layout: boolean) => void;
    receiverName: string;
    receiverImage: string;
    lastMessageTime?: Date;
}

const ChatHeader = ({ setLayout, receiverName, receiverImage }: ChatHeaderProps) => {
    return (
        <div className="flex items-center gap-4 h-16 px-4 bg-white border-b border-slate-200 shrink-0 shadow-sm">
            <button
                onClick={() => setLayout(false)}
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label="뒤로가기"
            >
                <HiOutlineArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="shrink-0">
                    <Avatar src={receiverImage} />
                </div>
                <h2 className="font-semibold text-slate-800 truncate">{receiverName}</h2>
            </div>
        </div>
    );
};

export default ChatHeader;