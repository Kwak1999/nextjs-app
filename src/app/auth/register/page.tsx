'use client';
import React, { useState } from 'react';
import Input from "@/app/components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from 'axios';

const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: { name: '', email: '', password: '' }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (body) => {
        setIsLoading(true);
        try {
            await axios.post('/api/register', body);
            router.push('/auth/login');
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
                    <h1 className="text-2xl font-bold text-slate-800">회원가입</h1>
                    <p className="mt-1 text-sm text-slate-500">새 계정을 만들어 보세요</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Input id="name" label="이름" disabled={isLoading} register={register} errors={errors} required />
                    <Input id="email" label="이메일" disabled={isLoading} register={register} errors={errors} required />
                    <Input id="password" label="비밀번호" type="password" disabled={isLoading} register={register} errors={errors} required />
                    <Button label="회원가입" disabled={isLoading} />
                    <p className="text-center text-sm text-slate-500">
                        이미 계정이 있으신가요?{" "}
                        <Link href="/auth/login" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
                            로그인
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;