# 🛒 중고마켓 만들기

---
## 개발일지 
[<img src= "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FBy8c6%2Fbtr0zSOlVmw%2FAAAAAAAAAAAAAAAAAAAAAGFLCgwjIV-txol-TNqX3HTUn0ytBga9XYY7ZeTf_EYU%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1764514799%26allow_ip%3D%26allow_referer%3D%26signature%3D8MviYcJnfTSmA%252FzUwYV%252FwzDPpKs%253D" width="400" height="200">](https://www.notion.so/298826d7994580f199dccd7f5f3dbf03?source=copy_link)

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
