# 🛒 중고거래 플랫폼

> Next.js 15 App Router 기반 풀스택 중고거래 웹 애플리케이션

---

## **프로젝트 소개**

**기간**

- 2025.11.13 – 2025.12.23 (약 8주)

**개요**

- Next.js 15(App Router)를 활용해 **중고거래 웹서비스의 핵심 흐름(인증 → 상품 등록 → 탐색 → 좋아요/채팅)**을 구현한 개인 프로젝트입니다.
- 강의를 기반으로 진행했지만, 단순 구현을 넘어서 **각 기능의 역할과 데이터 흐름을 이해하고 설명할 수 있는 상태를 목표로 개발**했습니다.

---

## **주요 기능 및 구현 내용**

- **NextAuth 기반 인증/인가**
    - Credentials 로그인 구현
    - JWT 세션을 사용해 로그인 상태 유지 및 미들웨어 기반 접근 제어
    - Admin/User 역할 분리 및 페이지 접근 권한 관리
- **상품 등록 기능**
    - Cloudinary를 활용한 이미지 업로드
    - Kakao Map API로 상품 위치 좌표 저장 및 지도 표시
    - React Hook Form을 활용한 폼 상태 관리 및 유효성 검사
- **좋아요(Favorite) 기능**
    - POST / DELETE API로 사용자-상품 관계 관리
    - `router.refresh()`를 활용해 서버 데이터 변경 후 UI 즉시 반영
    - Custom Hook(`useFavorite`)으로 로직 캡슐화 및 재사용
- **채팅 기능**
    - SWR을 활용한 데이터 패칭 및 주기적 갱신으로 실시간에 가까운 사용자 경험 구현
    - Conversation과 Message 모델 설계 및 자동 대화방 생성
    - Prisma의 관계형 쿼리로 복잡한 N:M 관계 처리

---

## **프로젝트 구조**

```
nextjs-app/
├── prisma/
│   └── schema.prisma              # DB 스키마 (User, Product, Conversation, Message)
├── src/
│   ├── app/
│   │   ├── actions/               # 서버 액션 (getCurrentUser, getProducts 등)
│   │   ├── api/                   # API 라우트
│   │   │   ├── products/          # 상품 등록 API
│   │   │   ├── favorites/         # 좋아요 API
│   │   │   ├── chat/              # 채팅 API
│   │   │   └── register/          # 회원가입 API
│   │   ├── components/            # 공통 컴포넌트
│   │   │   ├── KakaoMap.tsx       # 카카오 지도 (Dynamic Import)
│   │   │   ├── ImageUpload.tsx    # Cloudinary 업로드
│   │   │   ├── categories/        # 카테고리 컴포넌트
│   │   │   ├── chat/              # 채팅 UI
│   │   │   └── products/          # 상품 UI
│   │   ├── hooks/
│   │   │   └── useFavorite.ts     # 좋아요 Custom Hook
│   │   ├── auth/                  # 로그인/회원가입 페이지
│   │   ├── chat/                  # 채팅 페이지 (ChatClient with SWR)
│   │   ├── products/              # 상품 목록/상세/등록
│   │   ├── admin/                 # 관리자 페이지
│   │   └── middleware.ts          # 인증/인가 처리
│   ├── pages/api/auth/
│   │   └── [...nextauth].ts       # NextAuth 설정
│   ├── helpers/
│   │   ├── prismadb.ts            # Prisma 클라이언트 싱글톤
│   │   └── dayjs.ts               # 날짜 포맷 유틸
│   └── types/
│       ├── index.ts               # 공통 타입 정의
│       └── next-auth.d.ts         # NextAuth 타입 확장
└── docker-compose.yml             # PostgreSQL 컨테이너
```

---

## **사용 기술**

| 구분 | 기술 | 사용 목적 / 이유 |
| --- | --- | --- |
| **Frontend** | Next.js 15 (App Router) | 서버 컴포넌트 기반 데이터 패칭과 서버/클라이언트 책임 분리를 경험하기 위해 사용 |
|  | React 19 | 컴포넌트 단위 UI 구성 및 사용자 인터랙션 처리 |
|  | TypeScript | 서버 응답 및 컴포넌트 props에 타입을 적용해 안정성 확보 |
|  | Tailwind CSS | 빠른 UI 개발과 일관된 스타일 관리 |
| **Backend** | Next.js Route Handler | 상품, 좋아요, 채팅 관련 API 구현 |
|  | Prisma ORM | PostgreSQL과의 타입 안전한 쿼리 및 관계형 데이터 모델링 |
|  | PostgreSQL | 사용자, 상품, 채팅 데이터 저장 |
| **Authentication** | NextAuth.js | OAuth 및 Credentials 로그인 구현, JWT 기반 세션 관리 |
|  | Middleware | 인증 여부에 따른 페이지 접근 제어 |
| **State / Data** | SWR | 채팅 데이터의 주기적 동기화 및 UI 갱신 |
|  | React Hook Form | 폼 상태 관리 및 유효성 검사 |
| **External API** | Cloudinary | 상품 이미지 업로드 및 관리 |
|  | Kakao Map API | 상품 위치 선택 및 지도 표시 |
| **Infra / Tools** | Docker | PostgreSQL 로컬 개발 환경 구성 |
|  | Git / GitHub | 코드 버전 관리 및 프로젝트 이력 관리 |

---

## **설치 및 실행**

### 1. 환경 변수 설정

`.env` 파일 생성:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nextjs_app"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-preset"
NEXT_PUBLIC_KAKAO_MAP_KEY="your-kakao-key"
```

### 2. 설치 및 실행

```bash
# 의존성 설치
npm install

# PostgreSQL 실행 (Docker)
docker-compose up -d

# Prisma 설정
npx prisma generate
npx prisma db push

# 개발 서버 실행
npm run dev
```

### 3. 주요 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm run start

# Prisma Studio (DB 확인)
npx prisma studio
```
