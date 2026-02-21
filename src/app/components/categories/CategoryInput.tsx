import React from 'react';
import { IconType } from 'react-icons';

interface CategoryInputProps {
    icon: IconType;
    label: string;
    path: string;
    selected?: boolean;
    onClick: (value: string) => void;
}

const CategoryInput = ({ icon: Icon, label, selected, onClick, path }: CategoryInputProps) => {
    return (
        <div
            onClick={() => onClick(path)}
            className={`
                rounded-xl p-4 flex flex-col gap-3
                border-2 cursor-pointer transition-all duration-200
                hover:shadow-md hover:border-teal-400
                ${selected ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-white text-slate-700'}
            `}
        >
            <Icon size={28} className={selected ? 'text-teal-600' : 'text-slate-500'} />
            <div className="font-semibold text-sm">{label}</div>
        </div>
    );
};

export default CategoryInput;
