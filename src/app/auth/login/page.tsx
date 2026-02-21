'use client';
import React, { useState } from 'react';
import Input from "@/app/components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: { email: '', password: '' }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (body) => {
        setIsLoading(true);
        try {
            await signIn('credentials', { ...body, redirect: false });
            router.push('/');
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">로그인</h1>
                    <p className="mt-1 text-sm text-slate-500">중고마켓에 오신 것을 환영합니다</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Input id="email" label="이메일" disabled={isLoading} register={register} errors={errors} required />
                    <Input id="password" label="비밀번호" type="password" disabled={isLoading} register={register} errors={errors} required />
                    <Button label="로그인" disabled={isLoading} />
                    <p className="text-center text-sm text-slate-500">
                        계정이 없으신가요?{" "}
                        <Link href="/auth/register" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                            회원가입
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default LoginPage;