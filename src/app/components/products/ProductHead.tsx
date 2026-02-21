import React from 'react';
import { User } from "@prisma/client";
import Heading from "@/app/components/Heading";
import HeartButton from "@/app/components/HeartButton";
import Image from "next/image";

interface ProductHeadProps {
    title: string;
    imageSrc: string;
    id: string;
    currentUser?: User | null;
}

const ProductHead = ({ title, imageSrc, id, currentUser }: ProductHeadProps) => {
    return (
        <>
            <Heading title={title} />
            <div className="w-full h-[50vh] min-h-[300px] overflow-hidden rounded-2xl relative bg-slate-100 shadow-lg">
                <Image
                    src={imageSrc}
                    fill
                    className="object-cover"
                    alt={title}
                    priority
                />
                <div className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-md backdrop-blur-sm">
                    <HeartButton productId={id} currentUser={currentUser} />
                </div>
            </div>
        </>
    );
};

export default ProductHead;