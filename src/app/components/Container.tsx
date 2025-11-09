import React from 'react';

// ✅ Container 컴포넌트에 전달될 props 타입 정의
interface ContainerProps {
    children: React.ReactNode; // 내부에 렌더링할 컴포넌트나 요소
}

// ✅ 페이지 전체 레이아웃을 감싸는 공용 컨테이너 컴포넌트
const Container = ({ children }: ContainerProps) => {
    return (
        <div
            className='
                max-w-[2520px]  // 최대 너비 설정
                mx-auto         // 가로 중앙 정렬
                xl:px-20        // 초대형 화면에서 좌우 여백 20px
                md:px-10        // 중간 화면에서 좌우 여백 10px
                sm:px-2         // 작은 화면에서 좌우 여백 2px
                px-4            // 기본 좌우 여백 4px
                py-6            // 상하 여백 6px
            '
        >
            {/* 하위(children) 요소를 감싸서 렌더링 */}
            <div>{children}</div>
        </div>
    );
};

export default Container;
