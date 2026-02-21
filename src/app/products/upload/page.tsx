'use client';

import React from 'react';
import Input from "@/app/components/Input";
import Container from '@/app/components/Container';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import ImageUpload from "@/app/components/ImageUpload";
import { categories } from '@/app/components/categories/Categories';
import CategoryInput from '@/app/components/categories/CategoryInput';
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HiOutlineMap } from 'react-icons/hi';
import { toast } from 'react-toastify';

const KakaoMap = dynamic(() => import('@/app/components/KakaoMap'), { ssr: false });

const ProductUploadPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
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

    const imageSrc = watch('imageSrc');
    const category = watch('category');
    const latitude = watch('latitude');
    const longitude = watch('longitude');

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post('/api/products', data)
            .then((res) => {
                toast.success('상품이 등록되었습니다.');
                router.push(`/products/${res.data.id}`);
                router.refresh();
            })
            .catch((err) => {
                toast.error('등록에 실패했습니다. 다시 시도해 주세요.');
                console.error(err);
                setIsLoading(false);
            });
    };

    const setCustomValue = (id: string, value: any) => setValue(id, value);

    const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );

    return (
        <Container>
            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">상품 등록</h1>
                    <p className="mt-1 text-slate-500">판매할 상품 정보를 입력해 주세요</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    {/* 이미지 */}
                    <SectionCard title="상품 이미지">
                        <ImageUpload
                            onChange={(v) => setCustomValue("imageSrc", v)}
                            value={imageSrc}
                        />
                    </SectionCard>

                    {/* 기본 정보 */}
                    <SectionCard title="기본 정보">
                        <div className="flex flex-col gap-6">
                            <Input
                                id="title"
                                label="상품명"
                                disabled={isLoading}
                                register={register}
                                errors={errors}
                                required
                            />
                            <Input
                                id="description"
                                label="상품 설명"
                                disabled={isLoading}
                                register={register}
                                errors={errors}
                                required
                            />
                            <Input
                                id="price"
                                label="가격(원)"
                                formatPrice
                                disabled={isLoading}
                                register={register}
                                errors={errors}
                                required
                            />
                        </div>
                    </SectionCard>

                    {/* 카테고리 */}
                    <SectionCard title="카테고리">
                        <p className="text-sm text-slate-500 mb-4">상품에 맞는 카테고리를 선택하세요</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {categories.map((item) => (
                                <CategoryInput
                                    key={item.label}
                                    onClick={(c) => setCustomValue('category', c)}
                                    selected={category === item.path}
                                    label={item.label}
                                    icon={item.icon}
                                    path={item.path}
                                />
                            ))}
                        </div>
                    </SectionCard>

                    {/* 위치 */}
                    <SectionCard title="거래 위치">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-600">
                                <HiOutlineMap size={18} />
                                <p className="text-sm">지도를 클릭하여 거래 장소를 선택하세요</p>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <KakaoMap
                                    setCustomValue={setCustomValue}
                                    latitude={latitude}
                                    longitude={longitude}
                                />
                            </div>
                        </div>
                    </SectionCard>

                    {/* 제출 버튼 */}
                    <div className="pt-2">
                        <Button
                            label={isLoading ? "등록 중..." : "상품 등록하기"}
                            disabled={isLoading}
                        />
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default ProductUploadPage;
