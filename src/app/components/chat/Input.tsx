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

        // ✅ 서버 전송 promise (이미지 업로드 포함)
        const sendPromise = (async () => {
            const imageUrl = image ? await uploadImage(image as File) : null;

            return trigger({
                text: message,
                image: imageUrl,           // 서버에는 실제 URL
                receiverId: receiverId,
                senderId: currentUserId,
            });
        })();


        const imageUrl = image ? await uploadImage(image as File) : null;

        if (message || imageUrl) {
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
        };

        setMessage('');
        setImage(null);
        setImagePreview(null);
    }

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='relative flex items-center justify-between w-full gap-4 p-2 pl-4 border-[1px] border-gray-300 rounded-md shadow-sm'
        >
            {imagePreview &&
                <div className='absolute right-0 w-full overflow-hidden rounded-md bottom-[4.2rem] max-w-[300px] shadow-md'>
                    <img src={imagePreview} alt="" />
                    <span
                        onClick={removeImage}
                        className='absolute flex items-center justify-center p-2 text-xl text-white bg-gray-900
           cursor-pointer top-[0.4rem] right-[0.4rem] rounded-full  opacity-60 hover:opacity-100'>
            <CgClose />
          </span>
                </div>
            }

            <input
                className='w-full text-base outline-none'
                type='text'
                placeholder='메시지를 작성해주세요.'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <input
                type="file"
                className='hidden'
                ref={imageRef}
                onChange={(e) => previewImage(e, setImagePreview, setImage)}
                accept='image/*'
                multiple={false}
            />


            <div onClick={chooseImage} className='text-2xl text-gray-200 cursor-pointer'>
                <IoImageOutline />
            </div>
            <button
                type='submit'
                className='flex items-center justify-center p-2 text-gray-900 bg-orange-500 rounded-lg cursor-pointer hover:bg-orange-600 disabled:opacity-60'
            >
                <RiSendPlaneLine className='text-white' />
            </button>
        </form>
    )
}

export default Input