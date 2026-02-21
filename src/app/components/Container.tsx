import React from 'react';

// ✅ Container 컴포넌트에 전달될 props 타입 정의
interface ContainerProps {
    children: React.ReactNode; // 내부에 렌더링할 컴포넌트나 요소
}

// ✅ 페이지 전체 레이아웃을 감싸는 공용 컨테이너 컴포넌트
const Container = ({ children }: ContainerProps) => {
    return (
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-4 px-4 py-6">
            {/* 하위(children) 요소를 감싸서 렌더링 */}
            <div>{children}</div>
        </div>
    );
};

export default Container;
