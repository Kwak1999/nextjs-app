'use client'
import React, {useEffect, useState} from 'react';
import {User} from "@prisma/client";
import axios from "axios";

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

    useEffect(() => {
        axios.get(`/api/chat`)
            .then((res) => console.log(res));
    }, [])

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