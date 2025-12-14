import Image from 'next/image'
import React from 'react';

interface AvatarProps {
    src: string | null
}

const Avatar = ({src}: AvatarProps) => {
    return (
        <Image
            className='w-10 h-10 rounded-full'
            height={30}
            width={30}
            alt="Avatar"
            src={src || "https://travel.rakuten.com/contents/sites/contents/files/styles/max_1300x1300/public/2024-07/photogenic-spots-japan_18_0.jpg?itok=m-FshNPR"}
        />
    );
};

export default Avatar;