import React from 'react';
import Link from "next/link";
import {signIn, signOut} from "next-auth/react";
import {User} from '@prisma/client';

interface NavItemProps {
    mobile?: boolean;
    currentUser?: User | null;
}

const navLinkClass = "px-4 py-2 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-colors font-medium";
const navButtonClass = "px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium";


const NavItem = ({mobile, currentUser}: NavItemProps) => {
    const isAdmin = currentUser?.userType === 'Admin';

    return (
        <ul className={`flex gap-1 w-full items-center ${mobile ? "flex-col py-4 border-t border-slate-100 bg-slate-50" : "justify-end"}`}>
            {isAdmin && <li><Link href="/admin" className={navLinkClass}>관리자</Link></li>}
            <li><Link href="/user" className={navLinkClass}>내 정보</Link></li>
            <li><Link href="/chat" className={navLinkClass}>채팅</Link></li>
            {currentUser ? (
                <li><button onClick={() => signOut()} className={navLinkClass}>로그아웃</button></li>
            ) : (
                <li><button onClick={() => signIn()} className={navButtonClass}>로그인</button></li>
            )}
        </ul>
    );
};

export default NavItem;