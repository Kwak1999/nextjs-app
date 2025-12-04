import React from 'react';

import getCurrentUser from "@/app/actions/getCurrentUser";

const UserPage = async () => {

    // const session = await getServerSession(authOptions);
    // console.log("session", session);

    const userData = getCurrentUser()
    console.log("userdata", userData)
    return (
        <div>
            UserPage
        </div>
    );
};

export default UserPage;