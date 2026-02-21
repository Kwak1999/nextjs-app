import React from 'react';
import { User } from "@prisma/client";
import { IconType } from "react-icons";
import Avatar from "@/app/components/Avatar";
import ProductCategory from "@/app/components/products/ProductCategory";
import { formatTime } from "@/helpers/dayjs";
import { formatPrice } from "@/helpers/formatPrice";

interface ProductInfoProps {
    user: User;
    description: string;
    createdAt: Date;
    price: number;
    category?: {
        icon: IconType;
        label: string;
        description: string;
    };
}

const ProductInfo = ({ user, category, createdAt, description, price }: ProductInfoProps) => {
    return (
        <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div>
                <p className="text-2xl font-bold text-teal-600">₩{formatPrice(price)}</p>
                <p className="text-sm text-slate-500 mt-1">{formatTime(createdAt)}</p>
            </div>
            <hr className="border-slate-100" />
            <div className="flex items-center gap-3">
                <Avatar src={user?.image} />
                <div>
                    <p className="font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-sm text-slate-500">판매자</p>
                </div>
            </div>
            {category && (
                <>
                    <hr className="border-slate-100" />
                    <ProductCategory
                        icon={category.icon}
                        label={category.label}
                        description={category.description}
                    />
                </>
            )}
            <hr className="border-slate-100" />
            <div className="text-slate-600 leading-relaxed whitespace-pre-line">{description}</div>
        </div>
    );
};

export default ProductInfo;