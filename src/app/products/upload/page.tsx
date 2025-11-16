'use client';
import React from 'react';
import Input from "@/app/components/Input";
import Container from '@/app/components/Container';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import ImageUpload from "@/app/components/ImageUpload";
import { categories } from '@/app/components/categories/Categories';
import CategoryInput from '@/app/components/categories/CategoryInput';
import dynamic from "next/dynamic";
import axios from "axios";
import {useRouter} from "next/navigation"; // ✅ 사용자 정의 레이아웃용 컨테이너 컴포넌트



const ProductUploadPage = () => {

    const router = useRouter();
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

    const KakaoMap = dynamic(() => import('@/app/components/KakaoMap'), {
        ssr: false
    });

    const imageSrc = watch('imageSrc')
    const category = watch('category');

    const latitude = watch('latitude');
    const longitude = watch('longitude');



    // 🔹 폼 제출 핸들러 (나중에 API 요청 연결 예정)
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log(data);
        setIsLoading(true);

        axios.post('/api/products', data)
            .then(res => {
                console.log('ok');
                // router.push(`/products/${res.data.id}`);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    const setCustomValue = (id:string, value: any) => {
        setValue(id, value)
    }

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
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
                        // ✅ 이미지 업로드 후, Cloudinary에서 받은 URL을 react-hook-form의 "imageSrc" 필드에 저장
                        onChange={(value) => setCustomValue("imageSrc", value)}

                        // ✅ 현재 선택된 이미지 URL (폼의 "imageSrc" 값)
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
                        grid-cols-1        // 기본 1열
                        md:grid-cols-2     // 중간 화면 이상에서는 2열 배치
                        gap-3              // 각 항목 간격
                        max-h-[50vh]       // 최대 높이 제한 (화면 절반)
                        overflow-y-auto    // 스크롤 가능 (카테고리 많을 때)
                    "
                    >
                        {/* ✅ 카테고리 선택 입력 영역 */}
                        {/* CategoryInput 컴포넌트를 categories 배열만큼 반복 렌더링 */}
                        {categories.map((item) => (
                            <div key={item.label} className='col-span-1'>
                                <CategoryInput
                                    // 🔹 카테고리 클릭 시 폼의 'category' 값 변경
                                    onClick={(category) => setCustomValue('category', category)}

                                    // 🔹 현재 선택된 카테고리 여부 판단
                                    selected={category === item.path}

                                    // 🔹 표시될 텍스트 및 아이콘
                                    label={item.label}
                                    icon={item.icon}
                                    path={item.path}
                                />
                            </div>
                        ))}
                    </div>
                    <hr />

                    {/* 위치 선택 지도 (카카오맵 컴포넌트 자리) */}
                    {/* KakaoMap */}
                    <KakaoMap
                        setCustomValue={setCustomValue}
                        latitude={latitude}
                        longitude={longitude}
                    />
                    {/* 폼 제출 버튼 */}
                    <Button label="상품 생성하기" />
                </form>
            </div>
        </Container>
    );
};

export default ProductUploadPage;
