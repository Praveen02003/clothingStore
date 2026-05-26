import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { mainContext } from '../../App';


export const AdminNavbar = () => {
    const {
        adminDisplayModeContent,
        setAdminDisplayModeContent
    } = useContext(mainContext);

    const navigate = useNavigate()

    // darkMode function 
    function darkMode() {
        var getTheme = (adminDisplayModeContent === "Light") ? "Dark" : "Light"
        setAdminDisplayModeContent(getTheme)
    }

    // logout function
    function logOut() {
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginUser')
        localStorage.removeItem('sidebarOpen')
        navigate('/login')
    }
    return (
        <div className={`flex items-center justify-between h-16 ${adminDisplayModeContent === "Light" ? 'bg-gray-700' : 'bg-gray-800'} border-b px-4`}>

            <div className="flex items-center gap-4">
                <h1 className="text-white font-bold"> <i className="fa-solid fa-truck-fast text-2xl"></i> Cartify</h1>
            </div>
            {/* logout button */}
            <div className="flex items-center gap-2">
                <div>
                    <button className="bg-white rounded text-black font-bold px-5 py-1" onClick={() => {
                        darkMode()
                    }}>
                        {adminDisplayModeContent === "Light"
                            ?
                            <div>
                                <i className="fa-solid fa-moon text-xl"></i> Dark
                            </div>
                            :
                            <div>
                                <i className="fa-regular fa-moon text-xl"></i> Light
                            </div>}
                    </button>
                </div>
                <button className="bg-red-500 px-3 py-2 rounded text-white font-bold text-sm md:me-8 lg:px-4" onClick={() => {
                    logOut()
                }}>
                    <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </button>
            </div>

        </div >
    )
}
