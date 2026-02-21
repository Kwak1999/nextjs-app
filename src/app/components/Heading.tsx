import React from 'react';

interface HeadingProps {
    title: string;
    subtitle?: string;
    center?: boolean;
}

const Heading = ({ title, subtitle, center }: HeadingProps) => {
    return (
        <div className={center ? 'text-center' : 'text-start'}>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{title}</h1>
            {subtitle && (
                <p className="mt-1 text-slate-500 font-normal">{subtitle}</p>
            )}
        </div>
    );
};

export default Heading;
