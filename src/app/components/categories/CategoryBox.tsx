import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

// ✅ 개별 카테고리 박스에 전달되는 props 타입 정의
interface CategoryBoxProps {
    icon: IconType;        // react-icons 아이콘 컴포넌트
    label: string;         // 카테고리 이름
    path: string;          // 쿼리 파라미터 값 (예: ?category=digital)
    selected?: boolean;    // 현재 선택된 카테고리 여부 (선택 시 스타일 변경)
}

// ✅ 카테고리 한 칸(아이콘 + 라벨)을 렌더링하는 컴포넌트
const CategoryBox = ({
                         icon: Icon,
                         label,
                         path,
                         selected
                     }: CategoryBoxProps) => {
    return (
        // 🔹 클릭 시 해당 카테고리로 이동
        // 예: /?category=digital
        <Link
            href={`/?category=${path}`}
            className={`
                flex
                flex-col
                items-center
                justify-center
                gap-2
                p-3
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                ${selected ? 'text-neutral-800' : 'text-neutral-500'}
            `}
        >
            {/* 카테고리 아이콘 */}
            <Icon size={26} />

            {/* 카테고리 이름 */}
            <div>{label}</div>
        </Link>
    );
};

export default CategoryBox;
