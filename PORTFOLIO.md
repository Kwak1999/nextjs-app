# 포트폴리오 요약

## 사용한 기술 스택
### Frontend
- **Next.js 15 (App Router)**: 서버 컴포넌트 기반 렌더링 및 Route Handler 연계
- **React 19**: 컴포넌트 기반 UI 설계
- **TypeScript**: 타입 안전성 확보 및 DX 개선
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **SWR**: 클라이언트 데이터 패칭/캐싱
- **React Hook Form**: 폼 상태 관리 및 검증
- **React Icons / React Loader Spinner / React Toastify**: UI 요소 및 알림

### Backend
- **Next.js Route Handler**: API 엔드포인트 구현
- **Prisma ORM**: 스키마 기반 타입 안전한 DB 접근
- **PostgreSQL**: 사용자/상품/채팅 데이터 저장
- **NextAuth.js**: OAuth + Credentials 인증, JWT 세션 전략
- **bcryptjs**: 비밀번호 해시

---

## 기능 설명
- **인증/인가**: NextAuth.js 기반 OAuth + Credentials 로그인, JWT 세션 전략, Middleware로 페이지 접근 제어
- **상품 등록/관리**: Cloudinary 이미지 업로드, React Hook Form 기반 상품 등록 폼, 카테고리 분류 및 상세 정보 관리
- **지도 기반 위치 등록**: Kakao Map API로 좌표 선택 및 지도 표시
- **좋아요(Favorite)**: 사용자-상품 관계를 API로 관리, 상태 변화 즉시 반영
- **실시간에 가까운 채팅**: SWR 폴링으로 대화 데이터 주기적 갱신, Conversation/Message 모델 기반 채팅

---

## 담당 역할 및 성과
- **포지션**: 개인 프로젝트 (Full-Stack)
- **담당 기능**
  - NextAuth.js 기반 로그인/세션 처리 및 권한 제어 구조 설계
  - Prisma 스키마 설계 및 관계형 쿼리 구성 (User, Product, Conversation, Message)
  - Cloudinary 업로드/카카오맵 연동 등 외부 API 통합
  - SWR 기반 채팅 데이터 동기화 및 UI 갱신 플로우 구현
- **성과**
  - 핵심 사용자 플로우(인증 → 상품 등록 → 탐색/좋아요 → 채팅) 완성
  - 서버/클라이언트 책임 분리 및 App Router 데이터 갱신 패턴 이해

---

## 기능 정의서 (초안)

### 사용자 인증
- **목표**: 사용자 신원 검증 및 세션 유지
- **정의**
  - OAuth(Google) 또는 Credentials 로그인 지원
  - JWT 세션 전략 채택, `middleware`에서 권한 체크
- **입력/출력**
  - 입력: 이메일/비밀번호 또는 OAuth 토큰
  - 출력: 세션 토큰(JWT), 사용자 프로필
- **예외 처리**
  - 잘못된 자격 증명 시 401 반환
  - 비로그인 사용자는 보호 경로 접근 차단

### 상품 등록
- **목표**: 판매자가 상품 정보를 등록하고 노출
- **정의**
  - Cloudinary 이미지 업로드
  - 상품 정보(제목, 설명, 가격, 카테고리, 위치) 저장
- **입력/출력**
  - 입력: 상품 메타데이터 + 이미지
  - 출력: 생성된 상품 ID 및 상세 정보

### 좋아요
- **목표**: 사용자-상품 선호 관계 관리
- **정의**
  - `favoriteIds` 혹은 사용자-상품 관계 테이블 업데이트
  - UI 즉시 반영 (서버 데이터 재조회)
- **입력/출력**
  - 입력: 상품 ID
  - 출력: 좋아요 상태(true/false)

### 채팅
- **목표**: 구매자-판매자 간 대화
- **정의**
  - Conversation 자동 생성
  - Message 저장 및 최신 메시지 갱신
- **입력/출력**
  - 입력: 수신자 ID, 메시지 텍스트/이미지
  - 출력: 메시지 객체 + 최신 대화 갱신

---

## API 설계서 (초안)

### 인증
- `POST /api/register`
  - **설명**: 회원가입
  - **Body**: `{ name, email, password }`
  - **Response**: `{ id, name, email }`
- `POST /api/auth/[...nextauth]`
  - **설명**: NextAuth 로그인 처리
  - **Response**: 세션/토큰 쿠키

### 상품
- `GET /api/products`
  - **설명**: 상품 목록 조회
  - **Query**: `category`, `search`, `page`
  - **Response**: `Product[]`
- `POST /api/products`
  - **설명**: 상품 등록
  - **Body**: `{ title, description, price, category, imageSrc, latitude, longitude }`
  - **Response**: `Product`
- `GET /api/products/[productId]`
  - **설명**: 상품 상세 조회
  - **Response**: `Product`

### 좋아요
- `POST /api/favorites/[productId]`
  - **설명**: 좋아요 추가
  - **Response**: `{ favoriteIds }`
- `DELETE /api/favorites/[productId]`
  - **설명**: 좋아요 제거
  - **Response**: `{ favoriteIds }`

### 채팅
- `GET /api/chat`
  - **설명**: 대화 목록 조회
  - **Response**: `Conversation[]`
- `POST /api/chat`
  - **설명**: 메시지 전송 (대화 생성 포함)
  - **Body**: `{ receiverId, text?, image? }`
  - **Response**: `Message`

---
