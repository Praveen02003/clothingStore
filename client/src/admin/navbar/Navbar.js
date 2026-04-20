import React from 'react'

export const Navbar = () => {
    return (
        <nav className="bg-gray-500 fixed w-full z-20 top-0 start-0 border-b border-default">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

                <a href={"/admin/dashboard"} className="flex items-center space-x-3">
                    <span className="text-xl text-white font-semibold whitespace-nowrap">
                        <i className="fa-solid fa-shirt"></i> Travo
                    </span>
                </a>

                <div className="flex md:order-2 space-x-3">
                    <button
                        type="button"
                        className="text-white bg-red-500 hover:bg-red-600 border border-transparent focus:ring-4 focus:ring-red-300 shadow font-medium rounded text-sm px-3 py-2 cursor-pointer"
                    >
                        Logout
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded md:hidden hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
                        </svg>
                    </button>
                </div>

                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded bg-gray-100 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent">

                        <li>
                            <a href={'/admin/dashboard'} className="block py-2 text-white md:hover:text-gray-200">
                                Home
                            </a>
                        </li>

                        <li>
                            <a href="#" className="block py-2 text-white md:hover:text-gray-200">
                                Go to UserDashboard
                            </a>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    )
}