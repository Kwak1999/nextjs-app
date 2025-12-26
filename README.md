# 🛒 중고마켓
중고 거래 플랫폼 웹 서비스 개발

2025.11.13 – 2025.12.23 (약 5주)

Next.js(App Router) 기반 중고거래 웹 플랫폼을 기획·개발하며
인증/인가, 상품 등록, 위치 기반 필터링, 좋아요 기능까지 구현한 개인 프로젝트입니다.

---

## 🔹 프로젝트 개요

- 목적: 실제 서비스 수준의 인증/인가 흐름과 CRUD 경험 확보

- 타겟: 로그인 기반 중고 거래 서비스

- 형태: 개인 프로젝트 (기획 ~ 구현 전 과정 담당)
---

## 🔹 담당 역할

- 프론트엔드 및 서버 로직 100% 단독 구현

- DB 설계, 인증 구조, API 설계 직접 진행
---

## 🔹 주요 기능

- NextAuth 기반 인증/인가

- Google OAuth + Credentials 로그인

- JWT 기반 세션 관리

- Admin / User 권한 분리 및 접근 제어

- 상품 등록 및 조회

- Cloudinary 이미지 업로드

- 카테고리 선택 컴포넌트 구현

- Kakao Map API를 활용한 위치 기반 상품 등록

- 사용자 인터랙션

- 좋아요(Favorite) 기능 (POST/DELETE)

- 실시간 UI 반영 (router.refresh)

- Toast 알림 UX 적용
---

## 🔹 기술 스택

- Frontend: Next.js 15(App Router), React, TypeScript, Tailwind CSS

- Backend: Next.js Route Handler

- Auth: NextAuth (JWT Strategy)

- DB: PostgreSQL, Prisma ORM

- Infra: Docker, Cloudinary

- Etc: Kakao Map API, react-hook-form
--- 

## 가이드

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

# next-cloudinary
npm install next-cloudinary

# kakao-maps-sdk
npm i react-kakao-maps-sdk

#toastify
npm i react-toastify

#dayjs
npm i dayjs

#pagination
npm i @lucasmogari/react-pagination

#query-string
npm i query-string

#swr
npm i swr
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

`[...nextauth].ts`의 Prisma import 경로 수정:

```diff
- import { PrismaClient } from "@prisma/client";
+ import { PrismaClient } from "@/generated/prisma";
```

(`schema.prisma`의 `generator output`이 `./src/generated/prisma`로 설정되어 있음)

</details>
