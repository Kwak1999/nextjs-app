import React from 'react';
import Avatar from "@/app/components/Avatar";
import { fromNow } from "@/helpers/dayjs";
import Image from 'next/image';

interface MessageProps {
    isSender: boolean;
    messageText?: string | null,
    messageImage?: string | null,
    receiverName: string,
    receiverImage: string,
    senderImage: string | null,
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
        // ❌ 기존: grid + direction: rtl/ltr
        // ❌ direction 때문에 '안녕!' → '!안녕' 버그 발생
        // ✅ 수정: flex + flex-row-reverse 로 "배치만" 좌우 반전
        <div
            className={`w-full flex gap-3 ${
                isSender ? "flex-row-reverse" : "flex-row"
            } items-start`}
            // style={{ direction: isSender ? 'rtl' : 'ltr' }} <- 제거

        >
            {/* ❌ 기존 grid의 첫 번째 칸 */}
            {/* ✅ 수정: flex 구조에서 Avatar를 바로 배치 */}
            <Avatar
                src={isSender ? senderImage ?? receiverImage : receiverImage}
            />

            {/* ❌ 기존: items-start 고정 */}
            {/* ✅ 수정: 보낸 사람일 때 items-end */}
            <div
                className={`flex flex-col justify-center ${
                    isSender ? "items-end" : "items-start"
                }`}
            >
                {/* 헤더(You / 이름 / 시간) */}
                <div className="flex items-center gap-2 mb-2 text-sm">
          <span className="font-medium">
            {isSender ? "You" : receiverName}
          </span>
                    <span className="text-xs text-gray-500 opacity-80">
            {fromNow(time)}
          </span>
                </div>

                {/* 이미지 메시지 */}
                {messageImage && (
                    <div className="overflow-hidden rounded-md max-w-[80%]">
                        <Image
                            src={messageImage}
                            width={300}
                            height={300}
                            alt=""
                        />
                    </div>
                )}

                {/* 텍스트 메시지 */}
                {messageText && (
                    <div
                        className={`p-2 break-all text-white rounded-lg
            ${
                            isSender
                                ? "bg-orange-500 rounded-tr-none"
                                : "bg-gray-400 rounded-tl-none"
                        }`}
                    >
                        {/* ❌ 기존: <p>{messageText}</p> */}
                        {/* ✅ 수정: dir="auto" → 특수문자(!, ?, emoji) 순서 깨짐 방지 */}
                        <p dir="auto">{messageText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
