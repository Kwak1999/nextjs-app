import React, {PropsWithChildren} from 'react';
import {useSearchParams} from "next/navigation";
import {PRODUCTS_PER_PAGE} from "@/types/constants";
import qs from 'query-string';
import Link from "next/link";

type PaginationLinkProps = {
    page?: number | string;
    active?: boolean;
    disabled?: boolean;
} & PropsWithChildren

const PaginationLink = ({page, active, children, disabled}: PaginationLinkProps) => {

    const params = useSearchParams();
    const limit = PRODUCTS_PER_PAGE;
    const skip = page ? (Number(page) - 1) * limit : 0;


    let currentQuery = {};

    if(params){
        currentQuery = qs.parse(params?.toString())
    }
    // console.log(currentQuery)

    const updatedQuery = {
        ...currentQuery,
        page,
        skip
    };

    const href = `?${qs.stringify(updatedQuery)}`;

    return (
        <Link
            href={href}
            className={`
                min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium
                transition-colors
                ${active ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"}
                ${disabled ? "pointer-events-none opacity-40" : ""}
            `}
        >
            {children}
        </Link>
    );
};

export default PaginationLink;