'use client'

import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from "react-toastify";

const ToastProvider = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <ToastContainer
            autoClose={2000}
        />
    );
};

export default ToastProvider;