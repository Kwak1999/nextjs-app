# 🔹 프로젝트 개요
2025.10.20 – 2025.12.23 (약 8주)
프로젝트 목적/범위: Next.js 15(App Router)로 중고거래 웹서비스를 구축하며 인증,
상품 등록·조회, 위치 기반 필터, 좋아요 등 실제 서비스 흐름을 연습하는 개인 프로젝트입니다.

주요 스택: Next.js(서버 컴포넌트), React 19, TypeScript, Tailwind CSS, Prisma + PostgreSQL, NextAuth(JWT 기반), SWR, React Hook Form, Cloudinary, Kakao Map API 등을 사용합니다.

---

## 🔹 배운점

- 전체 스택 체험: Next.js 15 App Router·React 19·TypeScript·Tailwind를 중심으로, Prisma+PostgreSQL 백엔드, NextAuth 기반 인증, SWR/React Hook Form 등 실무형 풀스택 구성을 한 번에 경험할 수 있습니다.

- 주요 기능 흐름: OAuth/자격 증명 로그인, JWT 세션, 역할 분리(Admin/User), 상품 등록·조회, Cloudinary 업로드, 카테고리/위치 입력(Kakao Map), 좋아요/실시간 UI, 토스트 UX까지 전형적인 커머스 플로우를 학습할 수 있습니다.

- 환경 세팅 및 도구 사용: Next.js 빌드/실행, Prisma 초기화·db push, 인증/폼/지도/업로드용 라이브러리 설치 등 로컬 개발 환경 구성 과정을 명령어 단위로 익힐 수 있습니다.

- 버전 호환성 트러블슈팅: NextAuth와 Prisma 어댑터 버전 불일치로 인한 JSON 파싱 오류 사례가 기록돼 있어, 의존성 충돌을 진단·해결하는 방법을 학습할 수 있습니다.
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
| 구분                 | 기술                      | 사용 목적 / 이유                                      |
| ------------------ | ----------------------- | ----------------------------------------------- |
| **Frontend**       | Next.js 15 (App Router) | 서버 컴포넌트 기반 데이터 패칭과 서버/클라이언트 책임 분리를 위해 사용        |
|                    | React 19                | 컴포넌트 기반 UI 구성 및 사용자 인터랙션 처리                     |
|                    | TypeScript              | 서버 응답 및 컴포넌트 props에 타입을 적용해 안정성과 가독성 확보         |
|                    | Tailwind CSS            | 빠른 UI 개발과 공통 스타일 관리를 위해 사용                      |
| **Backend**        | Next.js Route Handler   | 상품 등록, 좋아요, 채팅 메시지 전송 등 사용자 이벤트 처리              |
|                    | Prisma ORM              | PostgreSQL과의 타입 안전한 쿼리 및 관계형 데이터 모델링            |
|                    | PostgreSQL              | 사용자, 상품, 채팅 데이터 저장                              |
| **Authentication** | NextAuth.js             | Google OAuth 및 Credentials 로그인 구현, JWT 기반 세션 관리 |
|                    | Middleware              | 인증 여부에 따른 페이지 접근 제어(인가)                         |
| **State / Data**   | SWR                     | 채팅 기능에서 실시간에 가까운 데이터 동기화 및 optimistic UI 적용     |
|                    | React Hook Form         | 상품 등록 폼 상태 관리 및 유효성 검사                          |
| **External API**   | Cloudinary              | 상품 이미지 업로드 및 URL 기반 이미지 관리                      |
|                    | Kakao Map API           | 상품 등록 시 위치 선택 및 상세 페이지 지도 표시                    |
| **Infra / Tools**  | Docker                  | PostgreSQL 로컬 개발 환경 구성                          |
|                    | Axios                   | 클라이언트 ↔ 서버 API 통신                               |
|                    | Day.js                  | 날짜/시간 포맷 처리                                     |
|                    | Git / GitHub            | 코드 버전 관리 및 프로젝트 관리                              |

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
