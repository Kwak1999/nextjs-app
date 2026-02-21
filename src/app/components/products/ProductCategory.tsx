import React from 'react';
import {IconType} from "react-icons";

interface ProductCategoryProps {
    icon: IconType;
    label: string;
    description: string;
}

const ProductCategory = ({ icon: Icon, label, description }: ProductCategoryProps) => {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
            <Icon size={32} className="text-teal-600 shrink-0" />
            <div>
                <p className="font-semibold text-slate-800">{label}</p>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
    );
};

export default ProductCategory;
