import axios from 'axios';
import React, { FormEvent, useRef, useState } from 'react'
import { IoImageOutline } from 'react-icons/io5';
import { RiSendPlaneLine } from 'react-icons/ri';
import useSWRMutation from 'swr/mutation';
import { CgClose } from 'react-icons/cg';
import previewImage from '@/helpers/previewImage';
import uploadImage from '@/helpers/uploadImage';
import { useSWRConfig } from 'swr';


interface InputProps {
    receiverId: string;
    currentUserId: string;
}

const sendRequest = (url: string, { arg }: {
    arg: {
        text: string;
        image: string;
        receiverId: string;
        senderId: string;
    }
}) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
    }).then(res => res.json());
}

const Input = ({
                   receiverId,
                   currentUserId
               }: InputProps) => {

    const [message, setMessage] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    const { trigger } = useSWRMutation('/api/chat', sendRequest)
    const { mutate } = useSWRConfig();


    const chooseImage = () => {
        imageRef.current?.click();
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // ✅ 아무 것도 없으면 전송 안 함
        if (!message && !image) return;

        // ✅ optimistic 메시지(서버 응답 전 화면에 먼저 보일 데이터)
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            id: tempId,
            text: message,
            image: imagePreview ?? null, // 업로드 전이라도 미리보기는 먼저 보이게
            receiverId,
            senderId: currentUserId,
            createdAt: new Date().toISOString(),
        };

        const sendPromise = (async () => {
            const imageUrl = image ? await uploadImage(image as File) : null;
            return trigger({
                text: message,
                image: imageUrl,
                receiverId: receiverId,
                senderId: currentUserId,
            });
        })();

        if (message || image) {
            try {
                // ✅ 여기서 “/api/chat” 캐시를 먼저 업데이트(optimistic)
                await mutate(
                    '/api/chat',
                    sendPromise,
                    {
                        optimisticData: (users: any) => {
                            if (!users) return users;

                            return users.map((u: any) => {
                                if (u.id !== currentUserId) return u;

                                const convIndex = u.conversations.findIndex((c: any) =>
                                    c.users.some((uu: any) => uu.id === receiverId)
                                );

                                // 기존 대화방 있으면 messages 뒤에 추가
                                if (convIndex >= 0) {
                                    const conv = u.conversations[convIndex];
                                    const nextConv = {
                                        ...conv,
                                        messages: [...conv.messages, optimisticMessage],
                                    };

                                    return {
                                        ...u,
                                        conversations: [
                                            ...u.conversations.slice(0, convIndex),
                                            nextConv,
                                            ...u.conversations.slice(convIndex + 1),
                                        ],
                                    };
                                }

                                // 대화방이 없으면 새로 만들어 추가(최소 형태)
                                const newConv = {
                                    id: `temp-conv-${Date.now()}`,
                                    users: [{ id: currentUserId }, { id: receiverId }],
                                    messages: [optimisticMessage],
                                };

                                return {
                                    ...u,
                                    conversations: [...u.conversations, newConv],
                                };
                            });
                        },

                        rollbackOnError: true, // 서버 전송 실패 시 optimistic 자동 롤백
                        populateCache: false,  // POST 응답으로 캐시를 덮어쓰지 않게
                        revalidate: true,      // 성공하면 GET(/api/chat)로 다시 동기화
                    }
                );
            } catch (error) {
                console.error(error);
            } finally {
                setMessage('');
                setImage(null);
                setImagePreview(null);
            }
        }
    }

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    }

    const hasContent = message.trim() || image;

    return (
        <form onSubmit={handleSubmit} className="relative">
            {imagePreview && (
                <div className="absolute right-0 bottom-full mb-2 w-full max-w-[200px] overflow-hidden rounded-xl shadow-lg border border-slate-200">
                    <img src={imagePreview} alt="" className="w-full aspect-square object-cover" />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-800 transition-colors"
                    >
                        <CgClose size={16} />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3 p-2 pl-4 pr-2 bg-slate-100 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-400 transition-all">
                <input
                    className="flex-1 py-2.5 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    type="text"
                    placeholder="메시지를 입력하세요."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <input
                    type="file"
                    className="hidden"
                    ref={imageRef}
                    onChange={(e) => previewImage(e, setImagePreview, setImage)}
                    accept="image/*"
                />
                <button
                    type="button"
                    onClick={chooseImage}
                    className="p-2 rounded-full text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                >
                    <IoImageOutline size={22} />
                </button>
                <button
                    type="submit"
                    disabled={!hasContent}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        hasContent
                            ? "bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                    <RiSendPlaneLine size={20} />
                </button>
            </div>
        </form>
    );
}

export default Input