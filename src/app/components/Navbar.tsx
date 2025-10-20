'use client';
import React, {useState} from 'react';
import Link from "next/link";
import NavItem from "@/app/components/NavItem";

const Navbar = () => {
    const [menu, setMenu] = useState(false)

    const handleMenu = () => {
        setMenu(!menu);
    }

    return (
        <nav className='relative z-10 w-full bg-orange-500 text-white'>
            <div className='flex items-center justify-between mx-5 sm:mx-10 lg:mx-20'>
                {/* Logo click -> 메인페이지 이동 */}
                <div className='flex items-center text-2xl h-14'>
                    <Link href="/">Logo</Link>
                </div>

                {/* 화면이 small 크기로 작아질 경우 +,- 보이기 */}
                <div className='text-2xl sm:hidden'>
                    {menu === false ?
                        <button onClick={handleMenu}>+</button> :
                        <button onClick={handleMenu}>-</button> }
                </div>

                {/* small 사이즈가 되면 NavItem 숨기기 */}
                <div className='hidden sm:block'>
                    <NavItem />
                </div>
            </div>

            {/* small크기 이상일 때 숨기기 */}
            <div className='block sm:hidden'>
                {!menu ? null : <NavItem mobile />}
            </div>
        </nav>
    );
};

export default Navbar;