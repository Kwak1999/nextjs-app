'use client';
import React from 'react';
import { CldUploadWidget } from "next-cloudinary";
import { TbPhotoPlus } from "react-icons/tb";
import Image from 'next/image';

// ✅ 이미지 업로드 컴포넌트에 전달할 props 타입 정의
interface ImageUploadProps {
    onChange: (value: string) => void;  // 업로드 후 이미지 URL을 부모 컴포넌트로 전달
    value: string;                      // 현재 선택된 이미지 URL
}

// ✅ Cloudinary 업로드 위젯을 사용하는 이미지 업로드 컴포넌트
const ImageUpload = ({
                         onChange,
                         value
}: ImageUploadProps) => {

    // 🔹 업로드 완료 시 호출되는 콜백 함수
    const handleUpload = (result: any) => {
        console.log('result', result);                   // 업로드 결과 로그 출력
        onChange(result.info.secure_url);                // Cloudinary 업로드된 이미지 URL 전달
    }

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    return (
        <CldUploadWidget
            onSuccess={handleUpload}                      // 업로드 완료 시 콜백 실행
            uploadPreset={uploadPreset}                       // Cloudinary 업로드 설정 (Cloudinary preset 이름)
            options={{
                maxFiles: 1                              // 업로드 가능한 파일 수 제한
            }}
        >
            {({ open }) => {
                return (
                    // 🔹 업로드 위젯 열기 트리거
                    <div
                        onClick={() => open?.()}
                        className='relative flex flex-col items-center justify-center gap-4 p-20 transition border-2 border-dashed cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-300'
                    >
                        {/* 업로드 아이콘 */}
                        <TbPhotoPlus size={50} />

                        {/* 이미지가 있을 경우 미리보기 표시 */}
                        {value && (
                            <div className='absolute inset-0 w-full h-full'>
                                <Image
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    src={value}
                                    alt=""
                                />
                            </div>
                        )}
                    </div>
                )
            }}
        </CldUploadWidget>
    );
};

export default ImageUpload;
