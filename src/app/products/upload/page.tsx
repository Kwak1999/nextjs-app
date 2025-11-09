'use client';
import React from 'react';
import Input from "@/app/components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import { Container } from "postcss";
import Heading from "@/app/components/Heading";
import ImageUpload from "@/app/components/ImageUpload"; // ✅ 사용자 정의 레이아웃용 컨테이너 컴포넌트

const ProductUploadPage = () => {

    // 🔹 로딩 상태 관리
    const [isLoading, setIsLoading] = React.useState(false);

    // 🔹 react-hook-form 설정 (기본값 지정)
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            title: '',
            description: '',
            category: '',
            latitude: 33.5563,
            longitude: 126.79581,
            imageSrc: '',
            price: 1,
        }
    });

    const imageSrc = watch('imageSrc')

    // 🔹 폼 제출 핸들러 (나중에 API 요청 연결 예정)
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log(data);
        // TODO: 서버에 상품 데이터 전송 로직 추가 예정
    };

    const setCustomValue = (id:string, value: any) => {
        setValue(id, value)
    }

    return (
        <Container>
            <div className="max-w-screen-lg">
                {/* 🧾 상품 등록 폼 */}
                <form
                    className="flex flex-col gap-8"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Heading
                        title="Product Upload"
                        subtitle="upload your product"
                    />

                    <ImageUpload
                        onChange={(value) => setCustomValue("imageSrc", value)}
                        value={imageSrc}

                    />

                    {/* 상품명 입력 */}
                    <Input
                        id="title"
                        label="Title"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <hr />

                    {/* 상품 설명 입력 */}
                    <Input
                        id="description"
                        label="Description"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <hr />

                    {/* 가격 입력 (가격 형식 적용) */}
                    <Input
                        id="price"
                        label="Price"
                        formatPrice
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <hr />

                    {/* 카테고리 선택 영역 (추후 카테고리 컴포넌트 추가 예정) */}
                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-3
                            max-h-[50vh]
                            overflow-y-auto
                        "
                    >
                        {/* Category 선택 컴포넌트 자리 */}
                    </div>
                    <hr />

                    {/* 위치 선택 지도 (카카오맵 컴포넌트 자리) */}
                    {/* KakaoMap */}

                    {/* 폼 제출 버튼 */}
                    <Button label="상품 생성하기" />
                </form>
            </div>
        </Container>
    );
};

export default ProductUploadPage;
