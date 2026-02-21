'use client';
import React, {useState} from 'react';
import Link from "next/link";
import NavItem from "@/app/components/NavItem";
import { User } from "@prisma/client";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

interface NavbarProps {
    currentUser?: User | null;
}

const Navbar = ({currentUser}:NavbarProps) => {
    const [menu, setMenu] = useState(false);

    const handleMenu = () => setMenu(!menu);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link 
                    href="/" 
                    className="flex items-center gap-2 text-xl font-bold text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 text-teal-600">
                        🛒
                    </span>
                    <span>중고마켓</span>
                </Link>

                {/* 햄버거 메뉴 (모바일) */}
                <button
                    onClick={handleMenu}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors sm:hidden"
                    aria-label="메뉴 열기"
                >
                    {menu ? <HiOutlineX size={24} className="text-slate-600" /> : <HiOutlineMenu size={24} className="text-slate-600" />}
                </button>

                {/* 데스크탑 네비게이션 */}
                <div className="hidden sm:block">
                    <NavItem currentUser={currentUser} />
                </div>
            </div>

            {/* 모바일 메뉴 */}
            <div className={`sm:hidden overflow-hidden transition-all duration-200 ${menu ? 'max-h-64' : 'max-h-0'}`}>
                <NavItem mobile currentUser={currentUser} />
            </div>
        </nav>
    );
};

export default Navbar;