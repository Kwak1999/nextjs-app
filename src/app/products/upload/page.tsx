'use client';
import React from 'react';
import Input from "@/app/components/Input";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import Button from "@/app/components/Button";
import {Container} from "postcss";

const ProductUploadPage = () => {

    const [isLoading, setIsLoading] = React.useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState:{
            errors,
        },
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
    })
    const onSubmit: SubmitHandler<FieldValues> = (data) => {

    }

    return (
        <Container>
            <div
                className='
                    max-w-screen-lg
                '
            >
                <form className='
                    flex flex-col gap-8'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input
                        id="title"
                        label="Title"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <hr />
                    <Input
                        id="description"
                        label="Description"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    <hr />
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

                    <div
                        className='
                grid
                grid-cols-1
                md:grid-cols-2
                gap-3
                max-h-[50vh]
                overflow-y-auto
                '
                    >
                        {/*    Category     */}
                    </div>
                    <hr />
                    {/*    KakaoMap     */}

                    <Button label="상품 생성하기" />
                </form>

            </div>
        </Container>

    );
};

export default ProductUploadPage;