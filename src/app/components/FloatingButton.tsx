import Link from 'next/link';
import React from 'react';

interface FloatingButtonProps {
    children: React.ReactNode;
    href: string;
}

const FloatingButton = ({ children, href }: FloatingButtonProps) => {
    return (
        <Link
            href={href}
            className="fixed flex items-center justify-center text-white text-2xl font-light
                bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg hover:shadow-xl
                cursor-pointer bottom-6 right-6 w-14 h-14 transition-all duration-200
                z-40"
        >
            {children}
        </Link>
    );
};

export default FloatingButton;