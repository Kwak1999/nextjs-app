import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "react-toastify";

interface UseFavorite {
    productId: string;         // 좋아요를 토글할 대상 상품 ID
    currentUser?: User | null; // 현재 로그인한 유저 정보
}

const useFavorite = ({ productId, currentUser }: UseFavorite) => {
    const router = useRouter();

    /*
    =========================================================
      ✔ hasFavorite
      - 현재 유저가 해당 productId를 좋아요 했는지 여부를 boolean으로 판단
      - useMemo: currentUser 또는 productId가 변경될 때만 재계산
    =========================================================
    */
    const hasFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || []; // 좋아요 목록
        return list.includes(productId); // 해당 상품이 좋아요 목록에 있는지
    }, [currentUser, productId]);

    /*
    =========================================================
      ✔ toggleFavorite()
      - 좋아요 버튼 클릭 시 실행되는 함수
      - 로그인 여부 체크 → API 요청 (POST or DELETE)
      - 요청 후 router.refresh()로 페이지 상태 갱신
    =========================================================
    */
    const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
        // 부모 클릭 이벤트(상품 상세 페이지 이동)를 막음
        e.stopPropagation();

        // 로그인되어 있지 않으면 경고 메시지
        if (!currentUser) {
            toast.warn('먼저 로그인을 해주세요.');
            return;
        }

        try {
            let request;

            // 이미 좋아요 → 좋아요 취소 DELETE 요청
            if (hasFavorite) {
                request = () => axios.delete(`/api/favorites/${productId}`);
            }
            // 아직 좋아요 X → 좋아요 추가 POST 요청
            else {
                request = () => axios.post(`/api/favorites/${productId}`);
            }

            // API 요청 실행
            await request();

            // DB가 변경되었으므로 클라이언트 새로고침 (App Router 전용)
            router.refresh();

            // 성공 토스트
            toast.success('성공했습니다.');
        } catch (err) {
            // 실패 토스트
            toast.error('실패했습니다.');
        }
    };

    /*
    =========================================================
      리턴되는 값
      - hasFavorite: 현재 좋아요 여부 (UI에 반영됨)
      - toggleFavorite: 좋아요 버튼 클릭 함수
    =========================================================
    */
    return {
        hasFavorite,
        toggleFavorite,
    };
};

export default useFavorite;
