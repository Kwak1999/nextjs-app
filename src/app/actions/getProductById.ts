// import prisma from '@/helpers/prismadb';
//
// // ❗ Next.js의 [productId] 동적 라우트에서 전달되는 params 타입
// // productId가 optional(?)로 되어 있음 → 사실 이 라우트에서는 항상 있어야 함
// interface Params {
//     productId?: string;
// }
//
// export default async function getProductById(params: Params) {
//     try {
//         // ❗ 문제 포인트 1
//         // Next.js 최신 버전(App Router)에서는
//         // params가 "비동기(Promise)일 수도 있는 값"으로 취급됨
//         // → 하지만 여기서는 await 없이 바로 구조 분해함
//         // → 그래서 "params should be awaited" 경고 발생
//         const { productId } = params;
//
//         // ❗ 문제 포인트 2
//         // productId가 undefined일 수도 있는데 그대로 DB 조회에 사용됨
//         // (타입상 안전하지 않고, 의도도 불명확)
//         const product = await prisma.product.findUnique({
//             where: {
//                 id: productId, // string | undefined
//             },
//             include: {
//                 User: true,
//             },
//         });
//
//         // product가 없으면 null 반환
//         if (!product) return null;
//
//         return product;
//     } catch (error: any) {
//         // ❗ error 객체 전체를 다시 Error로 감싸는 건 좋지 않음
//         // (message가 아닌 객체가 들어갈 수 있음)
//         throw new Error(error);
//     }
// }


import prisma from '@/helpers/prismadb';

// Next.js 동적 라우트 [productId]에서 전달되는 params 타입
// productId는 타입상 optional이지만,
// 실제 [productId] 라우트에서는 항상 존재하는 값
interface Params {
    productId?: string;
}

// 특정 상품을 ID로 조회하는 서버 함수
export default async function getProductById(params: Params) {
    try {
        // ❗ Next.js(App Router) 최신 버전 대응 코드
        // params는 내부적으로 Promise일 수 있기 때문에
        // 구조 분해 전에 await로 값을 확정함
        const { productId } = await params;

        // 안전장치
        // productId가 없으면 잘못된 접근이므로 null 반환
        if (!productId) return null;

        // Prisma를 이용해 productId에 해당하는 상품 조회
        const product = await prisma.product.findUnique({
            where: {
                // productId는 string 타입이므로 안전하게 조회 가능
                id: productId,
            },
            include: {
                // 상품과 연관된 User(작성자) 정보도 함께 조회
                User: true,
            },
        });

        // DB에 해당 ID의 상품이 존재하지 않을 경우 null 반환
        if (!product) return null;

        // 상품이 존재하면 반환
        // (위에서 이미 null 체크를 했기 때문에 ?? null은 사실상 방어 코드)
        return product ?? null;

    } catch (error: any) {
        // 에러가 발생하면 에러 메시지를 그대로 전달
        // 메시지가 없는 경우 기본 에러 문구 사용
        throw new Error(error?.message ?? 'Failed to get product');
    }
}
