'use client'

import React from 'react';
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from "react-toastify";

const ToastProvider = () => {
    return (
        <ToastContainer
            autoClose={2000}
        />
    );
};

export default ToastProvider;