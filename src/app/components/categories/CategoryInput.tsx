import React from 'react';
import { IconType } from 'react-icons';

// ✅ 카테고리 선택 박스에 전달할 props 타입 정의
interface CategoryInputProps {
    icon: IconType;                // 아이콘 컴포넌트
    label: string;                 // 카테고리 이름
    path: string;                  // 카테고리 고유값 (상위에서 구분용)
    selected?: boolean;            // 선택 여부 (스타일 변경용)
    onClick: (value: string) => void; // 클릭 시 실행할 함수 (카테고리 선택 이벤트)
}

// ✅ 클릭으로 선택 가능한 카테고리 입력 박스 컴포넌트
const CategoryInput = ({
                           icon: Icon,
                           label,
                           selected,
                           onClick,
                           path
                       }: CategoryInputProps) => {
    return (
        // 🔹 클릭 시 onClick 함수 호출, path 값 전달
        <div
            onClick={() => onClick(path)}
            className={`
                rounded-xl           // 모서리 둥글게
                border-2             // 테두리 두께
                p-4                  // 내부 여백
                flex flex-col gap-3   // 세로 정렬 + 간격
                hover:border-orange-500 // 호버 시 주황색 테두리
                transition            // 부드러운 전환 효과
                cursor-pointer        // 마우스 커서 포인터
                ${selected ? 'border-orange-500' : 'border-neutral-200'} // 선택 시 색상 변경
            `}
        >
            {/* 카테고리 아이콘 */}
            <Icon size={30} />

            {/* 카테고리 이름 */}
            <div className='font-semibold'>
                {label}
            </div>
        </div>
    );
};

export default CategoryInput;
