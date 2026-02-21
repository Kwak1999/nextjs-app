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
    - Google OAuth 및 Credentials 로그인 구현
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

## **배운 점**

1. **전체 서비스 흐름에 대한 이해**
    - Next.js App Router 환경에서 서버 컴포넌트와 클라이언트 컴포넌트의 역할을 구분하며,
    인증 → 데이터 조회 → 사용자 인터랙션 → UI 갱신으로 이어지는 전체 흐름을 경험했습니다.
    - 클라이언트에서의 상태 관리보다 서버 데이터 재조회(`router.refresh()`)가 App Router의 핵심임을 이해했습니다.

2. **기능 구현보다 '설명 가능한 코드'의 중요성**
    - 강의를 따라 구현한 코드라도, 각 기능이 **왜 해당 위치에 존재하는지**와 **어떤 데이터 흐름을 가지는지**를 이해하지 않으면 설명할 수 없다는 점을 체감했습니다.
    - 특히 NextAuth의 JWT 콜백, 세션 콜백, Middleware의 역할을 명확히 이해하는 것이 중요함을 깨달았습니다.

3. **인증은 단일 기능이 아닌 흐름이라는 인식**
    - 로그인 구현 자체보다, 이후의 세션 유지, 권한에 따른 접근 제어, 서버 API 보호가 핵심임을 이해하게 되었습니다.
    - Middleware에서 JWT 토큰을 검증하여 매 요청마다 DB 조회 없이 권한을 확인하는 방식을 학습했습니다.

4. **Prisma ORM의 타입 안정성 활용**
    - Prisma가 스키마 기반으로 TypeScript 타입을 자동 생성하여, 컴파일 타임에 데이터베이스 관련 오류를 잡을 수 있다는 점이 인상적이었습니다.
    - `include`와 `select`를 활용한 N+1 쿼리 방지 및 효율적인 데이터 조회 방법을 익혔습니다.

5. **환경 설정 및 의존성 관리 경험**
    - NextAuth와 Prisma 어댑터 간 버전 불일치로 인한 JSON 파싱 오류를 겪으며, 라이브러리 버전 호환성과 의존성 관리의 중요성을 학습했습니다.
    - 공식 문서보다 실제 이슈 트래킹과 커뮤니티 경험이 중요함을 깨달았습니다.

---

## **어려웠던 점**

### 1. NextAuth + Prisma Adapter 버전 충돌

**문제 상황**
```
[next-auth][error][CLIENT_FETCH_ERROR]
"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
```

- NextAuth 실행 중 HTML 응답을 받아 JSON 파싱 에러 발생
- `@next-auth/prisma-adapter` 1.0.7과 `@prisma/client` 4.16.2 간 버전 불일치
- `prisma` 6.18.0과 `@prisma/client` 4.13.0 간 메이저 버전 차이

**해결 방법**
- 모든 Prisma 관련 패키지를 `4.13.0`으로 통일
- `@next-auth/prisma-adapter`를 `1.0.6`으로 다운그레이드
- 패키지 간 호환성 확인의 중요성을 체감

### 2. App Router의 데이터 갱신 방식 이해

**문제 상황**
- Pages Router의 `mutate()` 방식이 App Router에서 작동하지 않음
- 좋아요 클릭 후 UI가 즉시 업데이트되지 않는 문제

**해결 방법**
- `router.refresh()`를 사용하여 서버 컴포넌트 재실행
- App Router는 서버 컴포넌트 중심이므로 클라이언트 상태 관리보다 서버 데이터 재조회가 우선임을 이해

### 3. Kakao Map SDK의 SSR 이슈

**문제 상황**
- Kakao Maps SDK가 `window` 객체를 참조하여 서버 렌더링 시 에러 발생

**해결 방법**
- `next/dynamic`을 사용하여 `ssr: false` 옵션으로 클라이언트 전용 렌더링
- 브라우저 전용 라이브러리는 동적 임포트 필수임을 학습

### 4. Prisma Client 생성 위치 문제

**문제 상황**
- `prisma generate` 실행 시 기본 경로에 생성되어 타입 추론이 제대로 안 됨

**해결 방법**
- `schema.prisma`의 `generator` 설정에 `output = "../src/generated/prisma"` 추가
- TypeScript 경로 별칭(`@/`)과 조합하여 일관된 임포트 경로 유지

---

## **새롭게 알게 된 점**

### 1. Next.js 15 App Router의 서버/클라이언트 컴포넌트 구분

**서버 컴포넌트 (기본값)**
- DB 직접 접근 가능 (`prisma.product.findMany()`)
- 환경 변수 서버 측에서 안전하게 사용
- 번들 크기 감소 (클라이언트에 전송 안 됨)

**클라이언트 컴포넌트 (`'use client'`)**
- `useState`, `useEffect`, 이벤트 핸들러 사용
- 브라우저 API 접근 가능
- SWR, React Hook Form 같은 라이브러리 사용

**핵심 교훈**
- 서버 컴포넌트를 최대한 활용하여 클라이언트 번들 크기 최소화
- 상호작용이 필요한 부분만 클라이언트 컴포넌트로 분리

### 2. NextAuth의 JWT vs Database 세션 전략

| 구분 | JWT 세션 | Database 세션 |
|------|----------|---------------|
| **저장 위치** | 클라이언트 쿠키 | 서버 DB |
| **성능** | DB 조회 불필요 (빠름) | 매 요청마다 DB 조회 |
| **보안** | 토큰 탈취 시 만료까지 유효 | 즉시 세션 무효화 가능 |
| **사용 사례** | 일반적인 웹 앱 | 높은 보안이 필요한 서비스 |

**프로젝트 선택**
- JWT 세션을 선택하여 Middleware에서 빠른 검증
- 역할 정보를 JWT에 포함하여 DB 조회 최소화

### 3. Prisma의 관계형 쿼리 최적화

**N+1 쿼리 문제 해결**
```typescript
// ❌ N+1 쿼리 발생
const products = await prisma.product.findMany();
for (const product of products) {
  const user = await prisma.user.findUnique({ where: { id: product.userId } });
}

// ✅ include로 한 번에 조회
const products = await prisma.product.findMany({
  include: { user: true }
});
```

**핵심 교훈**
- `include`, `select`로 필요한 데이터만 효율적으로 조회
- 복잡한 관계도 TypeScript 타입 추론으로 안전하게 접근

### 4. SWR을 활용한 실시간 데이터 동기화

```typescript
const { data: users } = useSWR(
  '/api/chat',
  fetcher,
  { refreshInterval: 1000 } // 1초마다 자동 갱신
);
```

**핵심 교훈**
- WebSocket 없이도 폴링 방식으로 간단한 실시간 기능 구현 가능
- `dedupingInterval`, `revalidateOnFocus` 옵션으로 성능 튜닝 가능

### 5. Docker Compose로 로컬 DB 환경 구성

```yaml
services:
  db:
    image: postgres:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: "postgres"
      POSTGRES_PASSWORD: "password"
    volumes:
      - db_data:/var/lib/postgresql/data
```

**핵심 교훈**
- 팀원 간 동일한 DB 환경 보장 (버전, 설정 통일)
- `volumes`로 컨테이너 재시작 시에도 데이터 유지

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

---

## **설치된 의존성 및 패키지**

### 프로젝트 생성
```bash
npx create-next-app@latest --typescript
```

### 인증 관련
```bash
npm install next-auth@^4.22.1
npm install @auth/prisma-adapter@^2.11.0
npm install @next-auth/prisma-adapter@^1.0.6
npm install bcryptjs@^2.4.3
npm install -D @types/bcryptjs@^2.4.6
```

### 데이터베이스 (Prisma + PostgreSQL)
```bash
npm install @prisma/client@^4.13.0
npm install @prisma/extension-accelerate@^2.0.2
npm install -D prisma@^4.13.0

# Prisma 초기화
npx prisma init

# 스키마 동기화
npx prisma db push

# Prisma 클라이언트 생성
npx prisma generate
```

### 폼 및 상태 관리
```bash
npm install react-hook-form@^7.66.0
npm install swr@^2.3.8
```

### UI 라이브러리
```bash
npm install react-icons@^5.5.0
npm install react-toastify@^11.0.5
npm install react-loader-spinner@^8.0.0
npm install @lucasmogari/react-pagination@^2.1.0
```

### 외부 API 연동
```bash
npm install next-cloudinary@^6.17.4
npm install react-kakao-maps-sdk@^1.2.0
```

### 유틸리티
```bash
npm install axios@^1.4.0
npm install dayjs@^1.11.19
npm install query-string@^9.3.1
```

### 개발 도구
```bash
npm install -D typescript@^5
npm install -D @types/node@^20
npm install -D @types/react@^19
npm install -D @types/react-dom@^19
npm install -D tailwindcss@^4
npm install -D @tailwindcss/postcss@^4
npm install -D eslint@^9
npm install -D eslint-config-next@15.5.6
npm install -D @eslint/eslintrc@^3
```

### 한 번에 설치 (복사용)
```bash
# Dependencies
npm install next@^15.5.7 react@19.1.0 react-dom@19.1.0 next-auth@^4.22.1 @auth/prisma-adapter@^2.11.0 @next-auth/prisma-adapter@^1.0.6 @prisma/client@^4.13.0 @prisma/extension-accelerate@^2.0.2 axios@^1.4.0 bcryptjs@^2.4.3 dayjs@^1.11.19 next-cloudinary@^6.17.4 react-hook-form@^7.66.0 react-icons@^5.5.0 react-kakao-maps-sdk@^1.2.0 react-loader-spinner@^8.0.0 react-toastify@^11.0.5 swr@^2.3.8 query-string@^9.3.1 @lucasmogari/react-pagination@^2.1.0

# DevDependencies
npm install -D typescript@^5 @types/node@^20 @types/react@^19 @types/react-dom@^19 @types/bcryptjs@^2.4.6 prisma@^4.13.0 tailwindcss@^4 @tailwindcss/postcss@^4 eslint@^9 eslint-config-next@15.5.6 @eslint/eslintrc@^3
```
