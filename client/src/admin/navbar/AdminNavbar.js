import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { mainContext } from '../../App'

export const AdminNavbar = () => {

    const {
        open,
        setOpen
    } = useContext(mainContext)
    const navigate = useNavigate()

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        navigate('/login')
    }
    return (
        <div className="flex items-center justify-between h-16 bg-gray-700 border-b px-4">

            <div className="flex items-center gap-4 p-5">

                {/* hamburger button */}
                <button
                    onClick={() => setOpen(true)}
                    className={`text-xl text-white ${open ? 'hidden' : 'block'}`}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>

                <h1 className="text-white font-bold"> <i className="fa-solid fa-truck-fast text-2xl"></i> Cartify</h1>
            </div>
            {/* logout button */}
            <div className="flex items-center gap-2">
                <button className="bg-red-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                    logOut()
                }}>
                    <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </button>
            </div>
        </div>
    )
}
