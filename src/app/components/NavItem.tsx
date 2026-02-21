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
    return (
        <ul className={`flex gap-1 w-full items-center ${mobile ? "flex-col py-4 border-t border-slate-100 bg-slate-50" : "justify-end"}`}>
            <li><Link href="/admin" className={navLinkClass}>Admin</Link></li>
            <li><Link href="/user" className={navLinkClass}>User</Link></li>
            <li><Link href="/chat" className={navLinkClass}>Chat</Link></li>
            {currentUser ? (
                <li><button onClick={() => signOut()} className={navLinkClass}>Signout</button></li>
            ) : (
                <li><button onClick={() => signIn()} className={navButtonClass}>Signin</button></li>
            )}
        </ul>
    );
};

export default NavItem;