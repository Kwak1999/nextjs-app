# 📐 포트폴리오 상세 아키텍처

> **이력서 → 프로젝트 → '문제 해결 역량' 그 한 줄**  
> • 전체 아키텍처 및 최적화 과정의 세분화된 아키텍처

---

## 목차

1. [전체 시스템 아키텍처](#1-전체-시스템-아키텍처)
2. [getCurrentUser 중복 호출 최적화 아키텍처](#2-getcurrentuser-중복-호출-최적화-아키텍처)
3. [채팅 API 데이터 과다 로드 최적화 아키텍처](#3-채팅-api-데이터-과다-로드-최적화-아키텍처)

---

## 1. 전체 시스템 아키텍처

### 1-1. 아키텍처 다이어그램

```mermaid
flowchart TB
    subgraph Client["Client Browser"]
        A1[React Components<br/>UI Rendering]
        A2[SWR Cache]
        A3[Local State]
    end

    subgraph NextJS["Next.js 15 App Router"]
        B1[Server Components<br/>Prisma Direct Fetch · SEO]
        B2[Client Components<br/>use client]
        B3[Middleware<br/>JWT 검증 · RBAC]
        B4[API Route Handlers<br/>REST API · 비즈니스 로직]
    end

    subgraph DataLayer["Data Access Layer"]
        C[Prisma ORM]
    end

    subgraph DB["PostgreSQL Database"]
        D1[(User)]
        D2[(Product)]
        D3[(Conversation)]
        D4[(Message)]
    end

    subgraph External["External Services"]
        E1[NextAuth]
        E2[Cloudinary]
        E3[Kakao Map API]
    end

    Client -->|HTTP/HTTPS| NextJS
    B4 --> C
    C --> DB
    B4 --> External
```

### 1-2. 데이터 플로우 다이어그램

```mermaid
flowchart TB
    Client[Client] -->|HTTP Request| MW[Middleware]
    MW -->|인증 통과| API[API Route / Server Component]
    API -->|Prisma Query| Prisma[Prisma ORM]
    Prisma -->|SQL| PG[(PostgreSQL)]
    PG -->|Result| Prisma
    Prisma -->|Typed Data| API
    API -->|JSON / HTML| Client
```

### 1-3. 시퀀스 다이어그램 (로그인 · API 인증)

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Middleware
    participant J as JWT
    participant A as API Route

    C->>M: API Request + Cookie
    M->>J: Verify JWT
    J-->>M: Decoded Token (user, role)
    M->>M: Check Permission (Admin/User)
    M->>A: Forward Request
    A->>A: Process
    A-->>M: Response
    M-->>C: Response
```

---

## 2. getCurrentUser 중복 호출 최적화 아키텍처

### 2-1. 문제 요약

| 구분 | 내용 |
|------|------|
| **문제** | Layout, Home, ProductDetail 등에서 동일 요청 내 `getCurrentUser()`가 여러 번 호출되어 DB 쿼리 중복 발생 |
| **해결** | `React.cache()`로 `getCurrentUser`를 감싸 동일 요청 내 첫 호출 결과를 메모이제이션 |
| **결과** | 동일 요청 내 getCurrentUser 호출 및 DB 쿼리 감소 (여러 번 → 1회) |

---

### 2-2. Before: 최적화 전 아키텍처

동일 HTTP 요청 내에서 각 컴포넌트가 독립적으로 `getCurrentUser()`를 호출하여 DB 쿼리가 중복 발생합니다.

```mermaid
sequenceDiagram
    participant Req as HTTP Request
    participant Layout as Layout
    participant Home as Home
    participant ProductDetail as ProductDetail
    participant GCU as getCurrentUser
    participant Session as getSession
    participant DB as PostgreSQL

    Req->>Layout: 렌더 요청
    Layout->>GCU: getCurrentUser() #1
    GCU->>Session: getSession()
    Session->>DB: 세션 조회
    DB-->>Session: 세션
    GCU->>DB: prisma.user.findUnique()
    DB-->>GCU: User
    GCU-->>Layout: User

    Req->>Home: 렌더 요청
    Home->>GCU: getCurrentUser() #2
    GCU->>Session: getSession()
    Session->>DB: 세션 조회
    DB-->>Session: 세션
    GCU->>DB: prisma.user.findUnique()
    DB-->>GCU: User
    GCU-->>Home: User

    Req->>ProductDetail: 렌더 요청
    ProductDetail->>GCU: getCurrentUser() #3
    GCU->>Session: getSession()
    Session->>DB: 세션 조회
    DB-->>Session: 세션
    GCU->>DB: prisma.user.findUnique()
    DB-->>GCU: User
    GCU-->>ProductDetail: User

    Note over DB: 동일 요청 내 DB 쿼리 3회 이상 발생
```

```mermaid
flowchart LR
    subgraph Before["최적화 전"]
        L[Layout] -->|호출 1| G1[getCurrentUser]
        H[Home] -->|호출 2| G2[getCurrentUser]
        P[ProductDetail] -->|호출 3| G3[getCurrentUser]
        G1 --> DB[(DB)]
        G2 --> DB
        G3 --> DB
    end
```

---

### 2-3. After: 최적화 후 아키텍처

`React.cache()`로 감싼 `getCurrentUser`는 동일 React 렌더 패스(요청) 내 첫 호출 시에만 DB를 조회하고, 이후 호출은 캐시된 결과를 반환합니다.

```mermaid
sequenceDiagram
    participant Req as HTTP Request
    participant Layout as Layout
    participant Home as Home
    participant ProductDetail as ProductDetail
    participant Cache as React.cache
    participant GCU as getCurrentUser
    participant DB as PostgreSQL

    Req->>Layout: 렌더 요청
    Layout->>Cache: getCurrentUser() #1
    Cache->>GCU: 첫 호출 → 실행
    GCU->>DB: getSession + prisma.user.findUnique
    DB-->>GCU: User
    GCU-->>Cache: User (캐시 저장)
    Cache-->>Layout: User

    Req->>Home: 렌더 요청
    Home->>Cache: getCurrentUser() #2
    Cache->>Cache: 캐시 히트 → 반환
    Cache-->>Home: User (캐시)

    Req->>ProductDetail: 렌더 요청
    ProductDetail->>Cache: getCurrentUser() #3
    Cache->>Cache: 캐시 히트 → 반환
    Cache-->>ProductDetail: User (캐시)

    Note over DB: 동일 요청 내 DB 쿼리 1회만 발생
```

```mermaid
flowchart LR
    subgraph After["최적화 후"]
        L[Layout] -->|호출 1| Cache[React.cache]
        H[Home] -->|호출 2| Cache
        P[ProductDetail] -->|호출 3| Cache
        Cache -->|첫 호출만| DB[(DB)]
        Cache -->|2,3번째| Cache
    end
```

### 2-4. getCurrentUser 내부 구조 (최적화 적용)

```mermaid
flowchart TB
    subgraph getCurrentUser["getCurrentUser (React.cache 적용)"]
        A[getSession] --> B{세션 존재?}
        B -->|No| C[return null]
        B -->|Yes| D[prisma.user.findUnique]
        D --> E[return User]
    end

    subgraph Callers["호출부"]
        F[Layout]
        G[Home]
        H[ProductDetail]
        I[API Route: favorites, chat, products...]
    end

    F --> getCurrentUser
    G --> getCurrentUser
    H --> getCurrentUser
    I --> getCurrentUser
```

---

## 3. 채팅 API 데이터 과다 로드 최적화 아키텍처

### 3-1. 문제 요약

| 구분 | 내용 |
|------|------|
| **문제** | GET /api/chat에서 전체 유저 + 전체 대화를 조회해 유저 수 증가 시 응답 데이터 과다 및 DB 부하 |
| **해결** | currentUser가 참여한 대화만 `conversation.findMany`로 조회 후, 프론트엔드 형식(User[])으로 변환하여 반환 |
| **결과** | 응답 데이터 크기·DB 쿼리 부하 감소, 채팅 기능 정상 동작 유지 |

---

### 3-2. Before: 최적화 전 아키텍처

`user.findMany()`로 전체 유저를 조회하고, 각 유저의 conversations·messages를 include하여 현재 로그인 유저와 무관한 데이터까지 모두 로드합니다.

```mermaid
flowchart TB
    subgraph Before["최적화 전: GET /api/chat"]
        Client[Client] -->|요청| API[API Route]
        API --> Q1["user.findMany()<br/>전체 유저 조회"]
        Q1 --> Include["include: {<br/>  conversations,<br/>  messages<br/>}"]
        Include --> DB[(PostgreSQL)]
        DB -->|전체 User 배열 및<br/>모든 대화·메시지| API
        API -->|과다한 JSON| Client
    end

    Note1[유저 100명 시: 100명 전체 및<br/>모든 대화·메시지 반환]
```

```mermaid
flowchart LR
    subgraph DataBefore["조회 데이터 범위 (Before)"]
        U1[User 1]
        U2[User 2]
        U3[User 3]
        Un[User N...]
        C1[Conv A]
        C2[Conv B]
        C3[Conv C]
        M1[Message...]
    end

    API[API] --> U1
    API --> U2
    API --> U3
    API --> Un
    U1 --> C1
    U2 --> C2
    U3 --> C3
    C1 --> M1
    C2 --> M1
    C3 --> M1
```

---

### 3-3. After: 최적화 후 아키텍처

`conversation.findMany`로 currentUser가 참여한 대화만 조회한 뒤, 프론트엔드가 기대하는 `User[]` 형식으로 변환하여 반환합니다.

```mermaid
flowchart TB
    subgraph After["최적화 후: GET /api/chat"]
        Client[Client] -->|요청| API[API Route]
        API --> GCU[getCurrentUser]
        GCU --> Q2["conversation.findMany(<br/>where: users.some.id = currentUser.id)"]
        Q2 --> Include2["include: {<br/>  users, messages<br/>}"]
        Include2 --> DB[(PostgreSQL)]
        DB -->|currentUser 참여 대화만| API
        API -->|변환 로직| Transform["User 배열 형식으로 변환<br/>currentUserWithConvs, otherUsersWithConvs"]
        Transform -->|최소 JSON| Client
    end

    Note2[currentUser 참여 대화만 조회 →<br/>응답 크기·DB 부하 감소]
```

```mermaid
flowchart LR
    subgraph DataAfter["조회 데이터 범위 (After)"]
        CU[currentUser]
        Conv1[Conv 1<br/>currentUser 참여]
        Conv2[Conv 2<br/>currentUser 참여]
        Other1[상대 User 1]
        Other2[상대 User 2]
    end

    API[API] --> CU
    CU --> Conv1
    CU --> Conv2
    Conv1 --> Other1
    Conv2 --> Other2
```

---

### 3-4. 데이터 변환 플로우 (conversations → User[])

```mermaid
flowchart TB
    subgraph Step1["1단계: 대화 조회"]
        A["conversation.findMany<br/>users.some.id = currentUser.id"]
        A --> B[conversations 배열]
    end

    subgraph Step2["2단계: currentUser + 대화"]
        B --> C["currentUserWithConvs = {<br/>  ...currentUser,<br/>  conversations<br/>}"]
    end

    subgraph Step3["3단계: 상대 유저별 그룹화"]
        B --> D["Map: 상대 유저별 그룹화"]
        D --> E[otherUsersWithConvs 배열]
    end

    subgraph Step4["4단계: 최종 반환"]
        C --> F["users 배열<br/>currentUserWithConvs, otherUsersWithConvs"]
        E --> F
        F --> G["NextResponse.json 호출"]
    end
```

### 3-5. Before vs After 비교 시퀀스

```mermaid
sequenceDiagram
    participant C as ChatClient
    participant API as GET /api/chat
    participant DB as PostgreSQL

    rect rgb(255, 230, 230)
        Note over C, DB: Before: 전체 유저·대화 조회
        C->>API: 요청
        API->>DB: user.findMany (전체)
        DB-->>API: 전체 User 배열 및 conversations, messages
        API-->>C: 과다한 JSON
    end

    rect rgb(230, 255, 230)
        Note over C, DB: After: currentUser 참여 대화만 조회
        C->>API: 요청
        API->>DB: conversation.findMany (filtered)
        DB-->>API: currentUser 관련 conversations
        API->>API: User 배열 형식으로 변환
        API-->>C: 최소 JSON
    end
```

---

*작성일: 2025*
