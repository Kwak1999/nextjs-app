'use client';
import React, {useState} from 'react';
import Link from "next/link";
import NavItem from "@/app/components/NavItem";
import { User } from "@prisma/client";

// Navbar가 서버로부터 받은 currentUser(로그인한 유저 정보)를 props로 전달받을 수 있도록 타입 정의
interface NavbarProps {
    currentUser?: User | null;
}

const Navbar = ({currentUser}:NavbarProps) => {
    const [menu, setMenu] = useState(false)
    // console.log('current' ,currentUser);

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
                    <NavItem currentUser={currentUser} />
                </div>
            </div>

            {/* small크기 이상일 때 숨기기 */}
            <div className='block sm:hidden'>
                {!menu ? null : <NavItem mobile currentUser={currentUser} />}
            </div>
        </nav>
    );
};

export default Navbar;