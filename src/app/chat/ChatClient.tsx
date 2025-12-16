'use client'
import React, {useEffect, useState} from 'react';
import {User} from "@prisma/client";
import axios, {AxiosResponse} from "axios";
import useSWR from "swr";
import {TUserWithChat} from "@/types";

interface ChatClientProps {
    currentUser?: User | null;
}

const ChatClient = ({currentUser}: ChatClientProps) => {

    const [receiver, setReceiver] = useState({
        receiverId: "",
        receiverName: "",
        receiverImage: "",
    })

    const [layout, setLayout] = useState(false);

    const fetcher = (url: string) => axios.get(url)
        .then((res) => res.data);
    const { data: users, error, isLoading } = useSWR('/api/chat', fetcher, {
        refreshInterval: 1000
    })

    const currentUserWithMessage = users?.find(
        (user: TUserWithChat) => user.email === currentUser?.email
    );

    if(isLoading) return <p>Loading...</p>
    if(error) return <p>Error</p>

    // useEffect(() => {
    //     axios.get(`/api/chat`)
    //         .then((res) => console.log(res));
    // }, [])
    console.log(users)

    return (
        <main>
            <div className='grid grid-cols-[ifr] md:grid-cols-[300px_1fr]'>
                <section className={`md:flex ${layout && 'hidden'}`}>
                    Contact
                </section>
                <section className={`md:flex ${!layout && 'hidden'}`}>
                    Chat
                </section>
            </div>
        </main>
    );
};

export default ChatClient;