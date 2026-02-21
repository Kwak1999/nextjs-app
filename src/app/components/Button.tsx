import React from 'react';
import {IconType} from "react-icons";

interface ButtonProps {
    label: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    icon: Icon
}) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            onClick={onClick}
            className={`
                relative flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer rounded-xl font-semibold
                transition-all duration-200
                w-full
                ${outline 
                    ? 'bg-white border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50' 
                    : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'}
                ${small ? 'text-sm py-2.5' : 'text-base py-3.5'}
            `}
        >
            {Icon && <Icon size={20} className="shrink-0" />}
            {label}
        </button>
    );
};

export default Button;