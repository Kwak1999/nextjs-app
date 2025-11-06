import React from 'react';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const UserPage = async () => {

    const session = await getServerSession(authOptions);
    console.log("session", session);
    return (
        <div>
            UserPage
        </div>
    );
};

export default UserPage;