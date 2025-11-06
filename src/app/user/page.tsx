import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
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