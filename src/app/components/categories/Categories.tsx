'use client';
import React from 'react';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { GiBoatFishing, GiIsland, GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import { FaSkiing } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import CategoryBox from './CategoryBox';

// ✅ 카테고리 목록 정의
// label: 화면에 표시될 이름
// path: URL 쿼리 파라미터 값 (?category=path)
// icon: 아이콘 컴포넌트
// description: 카테고리 설명 (툴팁 또는 상세정보용)
export const categories = [
    {
        label: '디지털기기',
        path: 'digital',
        icon: TbBeach,
        description: '디지털기기 카테고리입니다.'
    },
    {
        label: '생활가전',
        path: 'appliances',
        icon: GiWindmill,
        description: '생활가전 카테고리입니다.'
    },
    {
        label: '가구/인테리어',
        path: 'interior',
        icon: MdOutlineVilla,
        description: '가구/인테리어 카테고리입니다.'
    },
    {
        label: '여성의류',
        path: 'women-clothing',
        icon: TbMountain,
        description: '여성의류 카테고리입니다.'
    },
    {
        label: '남성패션/잡화',
        path: 'men-fashion',
        icon: TbPool,
        description: '남성패션/잡화 카테고리입니다.'
    },
    {
        label: '뷰티/미용',
        path: 'beauty',
        icon: GiIsland,
        description: '뷰티/미용 카테고리입니다.'
    },
    {
        label: '스포츠/레저',
        path: 'sports',
        icon: GiBoatFishing,
        description: '스포츠/레저 카테고리입니다.'
    },
    {
        label: '중고차',
        path: 'used-car',
        icon: FaSkiing,
        description: '중고차 카테고리입니다.'
    }
];

// ✅ 카테고리 목록을 렌더링하는 컴포넌트
const Categories = () => {
    // 현재 URL의 쿼리 파라미터(category) 가져오기
    const params = useSearchParams();
    const category = params?.get('category'); // 예: ?category=interior → category = 'interior'

    return (
        <div className="flex flex-row items-center justify-between gap-2 pt-6 overflow-x-auto border-b border-slate-200">
            {categories.map((item) => (
                <CategoryBox
                    key={item.label}
                    label={item.label}          // 카테고리명
                    path={item.path}            // URL 파라미터
                    icon={item.icon}            // 아이콘 컴포넌트
                    selected={category === item.path}  // 현재 선택된 카테고리인지 여부
                />
            ))}
        </div>
    );
};

export default Categories;
