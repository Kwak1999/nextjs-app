# 🛒 중고마켓 만들기

<details>
<summary>📘 진행과정 정리</summary>

<details>
<summary>1일차</summary>

- React App 생성
- Navbar 컴포넌트 생성
- User / Admin 페이지 생성
- 전체적인 파일 구조만 생성 후 Navbar 디자인 진행
</details>

<details>
<summary>2일차</summary>

- Prisma ORM 설정
- PostgreSQL 연결 및 Docker 환경 구축
- pgAdmin으로 DB GUI 관리
- NextAuth 및 Credential Provider 연결
- Prisma Adapter 사용으로 세션/유저 관리 연결
</details>

<details>
<summary>3일차</summary>

✅ **주요 기능**
- 로그인 후 특정 페이지 접근 허용
- 비로그인 상태 접근 시 `/auth/login` 리다이렉트
- `session.user` 타입 확장 (오토컴플릿 가능)

<details>
<summary>🔍 middleware.ts</summary>

```tsx
export { default } from 'next-auth/middleware';
export const config = { matcher: ["/admin/:path*", "/user"] };

// .env
NEXTAUTH_SECRET=nextAuthSecret
NEXTAUTH_URL=http://localhost:3000
```
</details>

<details>
<summary>🔍 세션에 토큰 데이터 추가</summary>

```tsx
callbacks: {
  async jwt({ token, user }) {
    return { ...token, ...user };
  },
  async session({ session, token }) {
    session.user = token;
    return session;
  }
}
```
</details>

<details>
<summary>🔍 next-auth 타입 확장</summary>

```tsx
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}
```
</details>
</details>

<details>
<summary>4일차 (인가 로직 & UI 컴포넌트)</summary>

- JWT 만료기간 설정
- Role 기반 페이지 접근 제어
- 로그인/회원가입 접근 제한
- Input, Button 공통 컴포넌트 구현

---

### 🔐 인증/인가 처리

<details>
<summary>middleware.ts</summary>

```tsx
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from 'next-auth/middleware';

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.JWT_SECRET });
  const pathname = req.nextUrl.pathname;

  // 로그인된 유저만 접근 가능
  if (pathname.startsWith('/user') && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 어드민만 접근 가능
  if (pathname.startsWith('/admin') && (session?.role !== 'Admin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 로그인된 유저는 /auth 페이지 접근 불가
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
```
</details>

<details>
<summary>[...nextauth].tsx</summary>

```tsx
jwt: {
  secret: process.env.JWT_SECRET,
  maxAge: 30 * 24 * 60 * 60 // 30days
},
session: {
  strategy: "jwt",
},
callbacks: {
  async jwt({ token, user }) {
    return { ...token, ...user };
  },
  async session({ session, token }) {
    session.user = token;
    return session;
  },
}
```
</details>

---

### 🧱 Input 컴포넌트

<details>
<summary>코드 보기</summary>

```tsx
import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors
}) => {
  return (
    <div className='relative w-full'>
      {formatPrice && <span className='absolute text-neutral-700 top-5 left-2'>\</span>}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        type={type}
        className={\`
          w-full
          p-4
          pt-6
          font-light
          bg-white
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          \${formatPrice ? 'pl-9' : 'pl-4'}
          \${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
          \${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
        \`}
      />
    </div>
  );
};

export default Input;
```
</details>

---

### 🧡 Button 컴포넌트

<details>
<summary>코드 보기</summary>

```tsx
import React from 'react';
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon
}) => {
  return (
    <button
      type='submit'
      disabled={disabled}
      onClick={onClick}
      className={\`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        \${outline ? 'bg-white' : 'bg-orange-500'}
        \${outline ? 'border-black' : 'border-orange-500'}
        \${outline ? 'text-black' : 'text-white'}
        \${small ? 'text-sm': 'text-md'}
        \${small ? 'py-1': 'py-3'}
        \${small ? 'font-light': 'font-semibold'}
        \${small ? 'border-[1px]': 'border-2'}
      \`}
    >
      {Icon && <Icon size={24} className='absolute left-4 top-3' />}
      {label}
    </button>
  );
};

export default Button;
```
</details>
</details>

</details>

---

## 🧰 명령어 정리

```bash
# Next.js 앱 생성
npx create-next-app@latest --typescript

# 빌드 및 실행
npm run build
npm run start

# Prisma 설치 및 초기화
npm install -D prisma
npx prisma init

# 스키마 push
npx prisma db push

# NextAuth & Prisma 연동
npm install next-auth @prisma/client @next-auth/prisma-adapter

# React Hook Form
npm install react-hook-form

# React Icons
npm i react-icons

# axios
npm i axios

# bcryptjs
npm install bcryptjs

```

---

<details>
<summary>⚙️ NextAuth + Prisma 버전 충돌 오류 해결 기록</summary>

## ⚠️ 오류 개요
NextAuth 실행 중 아래와 같은 오류 발생:

```
[next-auth][error][CLIENT_FETCH_ERROR]
https://next-auth.js.org/errors#client_fetch_error

"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
```

→ **NextAuth 클라이언트가 HTML 응답을 받아서 발생한 문제**  
원인은 **Prisma 및 Adapter 버전 불일치**

---

## 🔍 원인 분석
1. `@auth/prisma-adapter`, `@next-auth/prisma-adapter`, `@prisma/client`, `prisma` 버전 간 호환성 문제
2. Adapter와 Prisma 버전 차이로 DB 연결 시 JSON 파싱 실패
3. 클라이언트가 `< !DOCTYPE ...>` HTML 응답을 받아 `"Unexpected token '<'"` 발생

---

## 🧾 수정 전 `package.json`

<details>
<summary>자세히 보기</summary>

```json
{
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.0",
    "@next-auth/prisma-adapter": "^1.0.7",
    "@prisma/client": "^4.16.2",
    "@prisma/extension-accelerate": "^2.0.2",
    "next": "15.5.6",
    "next-auth": "^4.22.1",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "prisma": "^6.18.0",
    "typescript": "^5"
  }
}
```
</details>

---

## ✅ 수정 후 `package.json`

<details>
<summary>자세히 보기</summary>

```json
{
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.0",
    "@next-auth/prisma-adapter": "^1.0.6",
    "@prisma/client": "^4.13.0",
    "@prisma/extension-accelerate": "^2.0.2",
    "next": "15.5.6",
    "next-auth": "^4.22.1",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "prisma": "^4.13.0",
    "typescript": "^5"
  }
}
```
</details>

---

### 🔸 주요 변경점
- `@next-auth/prisma-adapter` → `^1.0.6`
- `@prisma/client` → `^4.13.0`
- `prisma` → `^4.13.0`

---

### 🧠 코드 수정 내용

`[...nextauth].tsx`의 Prisma import 경로 수정:

```diff
- import { PrismaClient } from "@prisma/client";
+ import { PrismaClient } from "@/generated/prisma";
```

(`schema.prisma`의 `generator output`이 `./src/generated/prisma`로 설정되어 있음)

</details>
