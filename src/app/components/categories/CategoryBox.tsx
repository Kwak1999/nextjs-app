import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    path: string;
    selected?: boolean;
}

const CategoryBox = ({ icon: Icon, label, path, selected }: CategoryBoxProps) => {
    return (
        <Link
            href={`/?category=${path}`}
            className={`
                flex flex-col items-center justify-center gap-2 py-4 px-4 min-w-[80px]
                border-b-2 transition-all duration-200 cursor-pointer
                ${selected ? 'border-teal-600 text-teal-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}
            `}
        >
            <Icon size={24} className={selected ? 'text-teal-600' : 'text-slate-400'} />
            <span className="text-sm whitespace-nowrap">{label}</span>
        </Link>
    );
};

export default CategoryBox;
