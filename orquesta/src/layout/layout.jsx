import React from 'react'
import './global.css'
import Sidebar from '../components/ui/sidebar'

export default function Layout({ children }) {
    return (
        <div className="container-fluid">
            <div className="row">
                <Sidebar />
                <main className="col-12 col-md-10 ms-md-auto main-content">{children}</main>
            </div>
        </div>
    )
}
