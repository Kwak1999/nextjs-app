'use client';
import React from 'react';
import { Product, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import HeartButton from '@/app/components/HeartButton';
import { fromNow } from '@/helpers/dayjs';
import { formatPrice } from '@/helpers/formatPrice';

interface ProductCardProps {
    data: Product;
    currentUser?: User | null;
}

const ProductCard = ({ data, currentUser }: ProductCardProps) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/products/${data.id}`)}
            className="col-span-1 cursor-pointer group"
        >
            <div className="flex flex-col w-full gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-full overflow-hidden aspect-square rounded-xl">
                    <Image
                        src={data.imageSrc}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        alt={data.title}
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton productId={data.id} currentUser={currentUser} />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-slate-800 line-clamp-2">
                        {data.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {data.category}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-lg font-bold text-teal-600">
                            ₩{formatPrice(data.price)}
                        </span>
                        <span className="text-xs text-slate-400">
                            {fromNow(data.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
