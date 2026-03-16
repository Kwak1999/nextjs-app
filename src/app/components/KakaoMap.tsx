'use client';

import React from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

const KAKAO_APPKEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || process.env.NEXT_PUBLIC_KAKAO_MAP_SECRET_KEY || '';

interface KakaoMapProps {
    latitude: number;
    longitude: number;
    setCustomValue?: (id: string, value: number) => void;
    detailPage?: boolean;
}

const KakaoMap = ({
                      latitude,
                      longitude,
                      setCustomValue,
                      detailPage = false
                  }: KakaoMapProps) => {
    const [loading, error] = useKakaoLoader({
        appkey: KAKAO_APPKEY,
        libraries: ['services', 'clusterer'],
    });

    const handleClick = (mouseEvent: kakao.maps.event.MouseEvent) => {
        if (detailPage) return;
        setCustomValue!('latitude', mouseEvent.latLng.getLat());
        setCustomValue!('longitude', mouseEvent.latLng.getLng());
    }

    if (!KAKAO_APPKEY) return <div className="h-[360px] flex items-center justify-center text-slate-500">카카오맵 API 키를 설정해 주세요.</div>;
    if (error) return <div className="h-[360px] flex items-center justify-center text-slate-500">지도를 불러올 수 없습니다.</div>;
    if (loading) return <div className="h-[360px] flex items-center justify-center bg-slate-100 rounded-xl animate-pulse">지도 로딩 중...</div>;

    return (
        <Map
            center={{ lat: latitude, lng: longitude }}
            style={{ width: "100%", height: "360px", borderRadius: "1rem" }}
            onClick={(_, mouseEvent) => handleClick(mouseEvent)}
        >
            <MapMarker position={{ lat: latitude, lng: longitude }}>

            </MapMarker>
        </Map>
    );
};

export default KakaoMap;