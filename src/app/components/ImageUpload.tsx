'use client';

import React from 'react';
import { CldUploadWidget } from "next-cloudinary";
import { TbPhotoPlus } from "react-icons/tb";
import Image from 'next/image';

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

const ImageUpload = ({ onChange, value }: ImageUploadProps) => {
    const handleUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    return (
        <CldUploadWidget
            onSuccess={handleUpload}
            uploadPreset={uploadPreset}
            options={{ maxFiles: 1 }}
        >
            {({ open }) => (
                <div
                    onClick={() => open?.()}
                    className="group relative flex flex-col items-center justify-center gap-4 min-h-[280px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer transition-all hover:border-teal-400 hover:bg-teal-50/30 overflow-hidden"
                >
                    {value ? (
                        <>
                            <Image
                                fill
                                src={value}
                                alt="상품 이미지"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-lg bg-white text-sm font-medium text-slate-700 shadow-lg">
                                    클릭하여 이미지 변경
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                                <TbPhotoPlus size={32} className="text-slate-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-600 font-medium">이미지를 업로드하세요</p>
                                <p className="text-slate-400 text-sm mt-1">클릭하거나 파일을 드래그하세요</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </CldUploadWidget>
    );
};

export default ImageUpload;
