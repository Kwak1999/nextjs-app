import React from 'react'

// ✅ Heading 컴포넌트에 전달할 props 타입 정의
interface HeadingProps {
    title: string;       // 제목 (필수)
    subtitle?: string;   // 부제목 (선택)
    center?: boolean;    // 중앙 정렬 여부 (기본값: false)
}

// ✅ 재사용 가능한 Heading 컴포넌트
const Heading = ({ title, subtitle, center }: HeadingProps) => {
    return (
        <div className={center ? 'text-center' : 'text-start'}>
            {/* 제목 */}
            <div className='text-2xl font-bold'>
                {title}
            </div>

            {/* 부제목 (있을 경우만 렌더링됨) */}
            <div className='mt-2 font-light text-neutral-500'>
                {subtitle}
            </div>
        </div>
    )
}

export default Heading
