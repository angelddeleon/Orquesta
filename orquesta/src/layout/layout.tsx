import React from 'react'
import './global.css'

export default function Layout({ children }) {
    return (
        <main className='vw-100 vh-100'>
            {children}
        </main>
    )
}