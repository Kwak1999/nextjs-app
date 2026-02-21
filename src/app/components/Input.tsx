import React from 'react';
import {FieldErrors, FieldValues, UseFormRegister} from "react-hook-form";

interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors
}

const Input: React.FC<InputProps> = ({
    id,
    label,
    type = "text",
    disabled,
    formatPrice,
    register,
    required,
    errors
}) => {
    const hasError = !!errors[id];
    const labelLeft = formatPrice ? 'left-10' : 'left-4';
    return (
        <div className="relative w-full">
            {formatPrice && (
                <span className="absolute text-slate-500 top-1/2 -translate-y-1/2 left-4 text-lg font-medium z-10 pointer-events-none">₩</span>
            )}
            <input
                id={id}
                disabled={disabled}
                {...register(id, { required })}
                placeholder=" "
                type={type}
                className={`
                    peer w-full p-4 pt-7 text-base font-normal
                    border-2 bg-white rounded-xl
                    outline-none transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    placeholder:text-transparent
                    ${formatPrice ? 'pl-10' : 'pl-4'}
                    ${hasError 
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' 
                        : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'}
                `}
            />
            <label
                htmlFor={id}
                className={`
                    absolute z-10 font-medium pointer-events-none
                    text-slate-500 transition-all duration-200
                    top-1/2 -translate-y-1/2
                    peer-focus:top-2 peer-focus:text-xs peer-focus:translate-y-0 peer-focus:text-teal-600
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:translate-y-0
                    ${formatPrice ? 'left-10' : 'left-4'}
                    ${hasError ? 'peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-rose-500' : ''}
                `}
            >
                {label}
            </label>
        </div>
    );
};

export default Input;