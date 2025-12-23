import React from 'react';
import Link from "next/link";
import {signIn, signOut} from "next-auth/react";
import {User} from '@prisma/client'

// NavItem 컴포넌트가 모바일 메뉴 여부(mobile)와 현재 로그인 유저(currentUser)를 전달받을 수 있도록 인터페이스 정의
// - mobile?: boolean → 모바일 메뉴인지 여부를 판단 (true일 경우 세로 배치)
// - currentUser?: User | null → 로그인된 유저 정보 (없으면 null)
interface NavItemProps {
    mobile?: boolean;
    currentUser?: User | null;
}

const NavItem = ({mobile, currentUser}: NavItemProps) => {

    return (
        <ul className={`text-md justify-center flex gap-4 w-full items-center ${mobile && "flex-col h-full" }`}>
           <li className='py-2 text-center border-b-4 cursor-pointer'><Link href="/admin">Admin</Link></li>
           <li className='py-2 text-center border-b-4 cursor-pointer'><Link href="/user">User</Link></li>
           <li className='py-2 text-center border-b-4 cursor-pointer'><Link href="/chat">Chat</Link></li>
            {currentUser
                ?
                <li className='py-2 text-center border-b-4 cursor-pointer'>
                    <button onClick={() => signOut()}>Signout</button>
                </li>
                :
                <li className='py-2 text-center border-b-4 cursor-pointer'>
                    <button onClick={() => signIn()}>Signin</button>
                </li>
            }
        </ul>
    );
};

export default NavItem;