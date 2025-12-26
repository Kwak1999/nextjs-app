# 🛒 중고 거래 웹 플랫폼

## 1. 프로젝트 소개 (한 줄 + 3줄)
    1. 프로젝트 소개

    Next.js(App Router) 기반의 중고 거래 웹 플랫폼으로
    상품 등록, 인증/인가, 실시간 채팅, 위치 기반 거래 기능을 포함한
    개인 프로젝트입니다.
    
    강의를 참고하되,
    👉 인증 구조 / 데이터 흐름 / 실시간 기능은 직접 수정·확장하며 구현했습니다.
---
## 2. 기획 배경 (왜 만들었는지)
    단순 CRUD가 아닌,

    ✅ 인증/인가 구조
    
    ✅ 이미지 업로드 & 위치 기반 기능
    
    ✅ 실시간 사용자 인터랙션
    
    을 모두 경험해보고 싶어 기획한 프로젝트입니다.
    
    특히 **“Next.js App Router 환경에서 인증 + 실시간 기능을 어떻게 안정적으로 구성할 수 있는가”**에 초점을 두었습니다.
---
## 3. 주요 기능
🔐 인증 / 사용자

- NextAuth 기반 로그인

    - Google OAuth

    - Credentials 로그인

- JWT 기반 세션 관리

- middleware를 활용한 페이지 접근 제어

🛍 상품

- 상품 등록 / 조회 / 상세 페이지

- Cloudinary 이미지 업로드

- 카테고리 필터링

- 좋아요(Favorite) 기능

- 페이지네이션 구현

🗺 위치 기반

- Kakao Map API 연동

- 상품 등록 시 위치 선택

- 상세 페이지 지도 표시

💬 실시간 채팅

- SWR 기반 채팅 데이터 패칭

- optimistic UI 적용

- 이미지 메시지 전송
---
## 4. 기술 스택 & 선택 이유
    Frontend

    Next.js 15 (App Router)
    → 서버 컴포넌트 + 데이터 패칭 구조 이해 목적
    
    React 19 + TypeScript
    → 타입 안정성과 컴포넌트 재사용성
    
    Backend / DB
    
    Prisma + PostgreSQL
    → 관계형 데이터 모델링 경험
    
    Route Handler(API)
    → 프론트/백 통합 구조 이해
    
    Auth / State
    
    NextAuth
    → 실무에서 가장 많이 쓰이는 인증 라이브러리
    
    SWR
    → 실시간 데이터 동기화 + optimistic update
    
    Infra / Etc
    
    Cloudinary (이미지)
    
    Kakao Map API
    
    Docker (PostgreSQL 로컬 환경)
---
## 5. 아키텍처 / 폴더 구조 설명
    src/
    ├─ app/                       # Next.js App Router 기반 페이지 & API
    │  ├─ (home)/                 # 홈 페이지 (그룹 라우트)
    │  │   ├─ page.tsx
    │  │   └─ loading.tsx
    │  │
    │  ├─ actions/                # 서버 전용 데이터 패칭 함수
    │  │   ├─ getCurrentUser.ts   # 로그인 유저 조회
    │  │   ├─ getProductById.ts   # 상품 상세 조회
    │  │   └─ getProducts.ts      # 상품 목록 조회 (필터/페이지네이션)
    │  │
    │  ├─ admin/                  # 관리자 영역
    │  │   └─ panel/
    │  │       └─ page.tsx
    │  │
    │  ├─ api/                    # Route Handler (Backend API)
    │  │   ├─ chat/route.ts       # 채팅 메시지 API
    │  │   ├─ favorites/          # 좋아요 기능 API
    │  │   ├─ products/route.ts   # 상품 CRUD API
    │  │   └─ register/route.ts   # 회원가입 API
    │  │
    │  ├─ auth/                   # 인증 관련 페이지
    │  │   ├─ login/page.tsx
    │  │   └─ register/page.tsx
    │  │
    │  ├─ chat/                   # 실시간 채팅 페이지
    │  │   ├─ ChatClient.tsx
    │  │   ├─ page.tsx
    │  │   └─ loading.tsx
    │  │
    │  ├─ components/             # 공통 UI 컴포넌트
    │  │   ├─ categories/         # 카테고리 UI
    │  │   │   ├─ Categories.tsx
    │  │   │   ├─ CategoryBox.tsx
    │  │   │   └─ CategoryInput.tsx
    │  │   │
    │  │   ├─ chat/               # 채팅 UI 컴포넌트
    │  │   │   ├─ Chat.tsx
    │  │   │   ├─ ChatHeader.tsx
    │  │   │   ├─ Contacts.tsx
    │  │   │   ├─ Input.tsx
    │  │   │   ├─ Message.tsx
    │  │   │   └─ User.tsx
    │  │   │
    │  │   ├─ products/           # 상품 UI 컴포넌트
    │  │   │   ├─ ProductCard.tsx
    │  │   │   ├─ ProductCategory.tsx
    │  │   │   ├─ ProductHead.tsx
    │  │   │   └─ ProductInfo.tsx
    │  │   │
    │  │   ├─ Avatar.tsx
    │  │   ├─ Button.tsx
    │  │   ├─ Container.tsx
    │  │   ├─ EmptyState.tsx
    │  │   ├─ FloatingButton.tsx
    │  │   ├─ Heading.tsx
    │  │   ├─ HeartButton.tsx
    │  │   ├─ ImageUpload.tsx
    │  │   ├─ Input.tsx
    │  │   ├─ KakaoMap.tsx
    │  │   ├─ Loader.tsx
    │  │   ├─ Navbar.tsx
    │  │   ├─ NavItem.tsx
    │  │   ├─ Pagination.tsx
    │  │   ├─ PaginationLink.tsx
    │  │   └─ ToastProvider.tsx
    │  │
    │  ├─ hooks/                  # 커스텀 훅
    │  │   └─ useFavorite.ts      # 좋아요 상태 관리
    │  │
    │  ├─ products/               # 상품 관련 페이지
    │  │   ├─ [productId]/        # 상품 상세
    │  │   │   ├─ page.tsx
    │  │   │   ├─ loading.tsx
    │  │   │   └─ ProductClient.tsx
    │  │   └─ upload/             # 상품 등록
    │  │       ├─ page.tsx
    │  │       └─ loading.tsx
    │  │
    │  ├─ user/                   # 유저 페이지
    │  │   └─ page.tsx
    │  │
    │  ├─ globals.css
    │  ├─ layout.tsx              # 전역 레이아웃 (Navbar, Toast, Script)
    │  └─ favicon.ico
    │
    ├─ helpers/                   # 공통 유틸 함수
    │  ├─ dayjs.ts                # 날짜 포맷 유틸
    │  ├─ previewImage.ts         # 이미지 미리보기
    │  ├─ uploadImage.ts          # 이미지 업로드
    │  └─ prismadb.ts             # Prisma Client
    │
    ├─ pages/                     # NextAuth 전용 pages router
    │  └─ api/auth/[...nextauth].ts
    │
    ├─ types/                     # 전역 타입 정의
    │  ├─ index.ts
    │  ├─ constants.ts
    │  └─ next-auth.d.ts
    │
    └─ middleware.ts              # 인증/권한 미들웨어
---
## 6. 어려웠던 문제 & 해결
❗ 문제 1: NextAuth + App Router 세션 흐름 혼란

- server / client 간 session undefined 발생

- adapter 버전 차이 이슈

✅ 해결

- getServerSession 기반 currentUser 패턴 정립

- 인증 흐름을 server → props → client로 명확히 분리

❗ 문제 2: 채팅 메시지 방향 & 특수문자 깨짐

- direction: rtl 사용 시 "안녕!" → "!안녕" 문제 발생

✅ 해결

- layout은 flex-row-reverse로 처리

- 텍스트는 dir="auto" 적용

❗ 문제 3: 실시간 채팅 UX 지연

- 메시지 전송 후 화면 반영 딜레이

✅ 해결

- SWR mutate + optimisticData 적용

- 실패 시 rollback 처리
---
## 7. 개선하고 싶은 점
    채팅 WebSocket(Socket.io) 전환
    
    무한 스크롤 적용
    
    어드민 페이지 고도화
    
    테스트 코드(Jest / Playwright) 추가
---

## 가이드

```bash
# Next.js 앱 생성
npx create-next-app@latest --typescript

# 빌드 및 실행
npm run build
npm run dev

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
