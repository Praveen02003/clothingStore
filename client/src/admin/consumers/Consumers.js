import React from 'react'
import { Navbar } from '../navbar/Navbar'

export const Consumers = () => {
    return (
        <div>
            <Navbar />

            <div className="mt-24 overflow-x-auto bg-white shadow rounded border">

                <div className="flex items-center justify-between flex-wrap space-y-4 md:space-y-0 p-4">

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>

                        <input
                            type="text"
                            id="input-group-1"
                            className="block w-full max-w-xs pl-9 pr-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Search"
                        />
                    </div>

                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Position</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr className="border-b hover:bg-gray-100">

                            <th className="flex items-center px-6 py-4 whitespace-nowrap">
                                <img className="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="" />
                                <div className="ml-3">
                                    <div className="font-semibold">Neil Sims</div>
                                    <div className="text-gray-500 text-sm">neil.sims@flowbite.com</div>
                                </div>
                            </th>

                            <td className="px-6 py-4">React Developer</td>

                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                    Online
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <a href="#" className="text-blue-600 hover:underline">Edit user</a>
                            </td>
                        </tr>

                    </tbody>
                </table>

            </div>
        </div>

    )
}
