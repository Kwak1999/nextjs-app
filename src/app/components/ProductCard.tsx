'use client';
import React from 'react';
import { Product, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import HeartButton from '@/app/components/HeartButton';
import { fromNow } from '@/helpers/dayjs';

interface ProductCardProps {
    data: Product;           // 상품 데이터 (DB에서 가져온 product row)
    currentUser?: User | null; // 로그인한 유저 정보 (좋아요 여부 판단에 사용)
}

const ProductCard = ({ data, currentUser }: ProductCardProps) => {

    const router = useRouter(); // 상품 클릭 시 상세 페이지 이동용 훅

    return (
        <div
            // 카드 전체 클릭 시 해당 상품 상세 페이지로 이동
            onClick={() => router.push(`/products/${data.id}`)}
            className='col-span-1 cursor-pointer group'
        >
            <div className='flex flex-col w-full gap-2'>
                {/*
                    상품 이미지 영역
                    - 부모 div에 'relative'를 줘야 내부의 absolute 요소(좋아요 버튼) 배치 가능
                */}
                <div className='relative w-full overflow-hidden aspect-square rounded-xl'>
                    {/*
                        Next.js Image 컴포넌트
                        fill → 부모 요소를 꽉 채움
                        group-hover:scale-110 → 부모 요소 hover 시 이미지 확대 효과
                    */}
                    <Image
                        src={data.imageSrc}
                        fill
                        sizes='auto'
                        className='object-cover w-full h-full transition group-hover:scale-110'
                        alt="product"
                    />

                    {/*
                        ❤️ 좋아요 버튼 배치 영역
                        absolute top-3 right-3 → 이미지 상단 우측에 고정
                    */}
                    <div className='absolute top-3 right-3'>
                        <HeartButton
                            productId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>

                {/* 상품 제목 */}
                <div className='text-lg font-semibold'>
                    {data.title}
                </div>

                {/* 카테고리 */}
                <div className='font-light text-neutral-500'>
                    {data.category}
                </div>

                {/* 가격 + 등록일 */}
                <div className='flex flex-row items-center justify-between gap-1'>
                    {/* 가격 */}
                    <div>
                        {data.price}{" "}
                        <span className='font-light'>원</span>
                    </div>

                    {/* 등록일 (fromNow: "3일 전", "2시간 전" 같은 포맷) */}
                    <div>
                        {fromNow(data.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;
