# 중고마켓 만들기
<details>
<summary>🧩 NextAuth Prisma 버전 충돌 오류 해결 기록</summary>

## ⚠️ 오류 개요

NextAuth 실행 중 아래와 같은 오류가 발생함:

[next-auth][error][CLIENT_FETCH_ERROR]
https://next-auth.js.org/errors#client_fetch_error

"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

이 오류는 **NextAuth 클라이언트가 예상치 못한 HTML 응답(예: 오류 페이지나 잘못된 API 응답)** 을 받아서 발생하는 문제임.  
이번 경우는 **Prisma 및 Adapter 간 버전 불일치**가 원인이었음.

## 🔍 원인 분석

1. `@auth/prisma-adapter`, `@next-auth/prisma-adapter`, `@prisma/client`, `prisma` 버전 간 호환성 문제
2. `@next-auth/prisma-adapter`와 `@prisma/client`의 버전이 일치하지 않아, NextAuth가 DB 연결 시 JSON 파싱 실패
3. 결과적으로 클라이언트 측에서 `< !DOCTYPE ...>` HTML 응답을 받아 `Unexpected token '<'` 오류가 발생함

## 수정 전 `package.json`
<details>
    <summary>자세히 보기</summary>

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

</details>

## 🧾 수정 후 `package.json`

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
</details>

🔸 주요 변경점

@next-auth/prisma-adapter → ^1.0.6

@prisma/client → ^4.13.0

prisma → ^4.13.0

🧠 코드 수정 내용

[...nextauth].tsx 파일 내 PrismaClient import 경로를 아래와 같이 수정함:
- // ❌ 기존 코드
  import { PrismaClient } from "@prisma/client";

- schema.prisma의 generator output 설정이 ./src/generated/prisma 이므로
- // ✅ 수정 코드
  import { PrismaClient } from "@/generated/prisma";
</details>





```bash
npx create-next-app@latest --typescript

npm run build

npm run start

# prisma 설치
npm install -D prisma
npx prisma init

# schema push
npx prisma db push

# next-auth 설치
npm install next-auth @prisma/client @next-auth/prisma-adapter

```