import Script from "next/script";


const KakaoMapScript = () => {
    return(
        <Script
            type="text/javascript"
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_SECRET_KEY}&libraries=services,clusterer&autoload=false`}
            strategy="afterInteractive"
        />
    )
}

export default KakaoMapScript;