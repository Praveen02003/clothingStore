import React, { useContext } from 'react'
import { mainContext } from '../../App'

export const Footer = () => {
    const {
        displayModeContent,
        setDisplayModeContent
    } = useContext(mainContext)
    return (
        <div>
            {/* footer section */}
            <footer className={`mt-20 p-10 ${displayModeContent === "Light" ? 'bg-gray-700' : 'bg-gray-800'}`}>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-5">

                    <div>
                        <h2 className="text-xl font-bold text-white">Cartify</h2>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 text-white">Cartify Tabs</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li>
                                <a href="/">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/consumers/products">
                                    Products
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 text-white">Support</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li>Low Pricing</li>
                            <li>Attractive Prices</li>
                            <li>New Collections</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 text-white">Company</h3>
                        <ul className="space-y-2 text-sm text-white">
                            <li>Certified company</li>
                            <li>All time support</li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div className="mt-5 pt-4 text-sm text-white text-center font-bold">
                    Powered by Cartify
                </div>

            </footer>
        </div>
    )
}
