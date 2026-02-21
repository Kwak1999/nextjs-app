import React from 'react';
import Image from 'next/image';
import { formatTime } from "@/helpers/dayjs";

interface MessageProps {
    isSender: boolean;
    messageText?: string | null;
    messageImage?: string | null;
    receiverName: string;
    receiverImage: string;
    senderImage: string | null;
    time: Date;
}

const Message = ({
    isSender,
    messageText,
    messageImage,
    receiverName,
    receiverImage,
    senderImage,
    time
}: MessageProps) => {
    return (
        <div
            className={`w-full flex gap-2 ${
                isSender ? "flex-row-reverse" : "flex-row"
            } items-end`}
        >
            {/* 아바타 - 상대 메시지에만 표시 (내 메시지는 생략) */}
            {!isSender && (
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <Image
                        src={receiverImage || "https://travel.rakuten.com/contents/sites/contents/files/styles/max_1300x1300/public/2024-07/photogenic-spots-japan_18_0.jpg?itok=m-FshNPR"}
                        width={32}
                        height={32}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            {isSender && <div className="w-8 shrink-0" />}

            <div className={`flex flex-col max-w-[75%] ${isSender ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-500">
                        {isSender ? "나" : receiverName}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatTime(time, 'h:mm A')}</span>
                </div>

                {messageImage && (
                    <div className="overflow-hidden rounded-2xl mb-1">
                        <Image
                            src={messageImage}
                            width={240}
                            height={240}
                            alt=""
                            className="object-cover max-w-[200px] max-h-[200px]"
                        />
                    </div>
                )}

                {messageText && (
                    <div
                        className={`px-4 py-2.5 break-words rounded-2xl ${
                            isSender
                                ? "bg-teal-500 text-white rounded-tr-md"
                                : "bg-white text-slate-800 rounded-tl-md shadow-sm border border-slate-100"
                        }`}
                    >
                        <p dir="auto" className="text-sm leading-relaxed">{messageText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
