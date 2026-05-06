import React from 'react'

export const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-28 bg-white shadow-xl rounded-lg">
                <h1 className="text-gray-900">
                    <i className="fa-solid fa-truck-fast text-8xl"></i>
                </h1>
                <p className="text-2xl font-medium mt-4 text-gray-900 text-7xl">404</p>
                <p className="text-2xl font-medium mt-4 text-gray-900">Page not found</p>
                <a href="/" className="mt-6 inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded-md">
                    Go back home
                </a>
            </div>
        </div>

    )
}
