import React from "react";
import AdminLayout from "@/layouts/AdminLayout";

const indexPolice = () => {
    return (
        <AdminLayout>
            <div>
                <div>
                    <h1>Police Station</h1>
                </div>
                <div className="w-full">
                <table className="min-w-full bg-white rounded-2xl px-2 shadow-[#123F7B]/25 shadow-lg overflow-hidden">
                    <thead className="bg-[#123F7B] text-white">
                        <tr>
                            <th className="py-2 px-4 text-start">ID</th>
                            <th className="py-2 px-4 text-start">Name</th>
                            <th className="py-2 px-4 text-start">Address</th>
                            <th className="py-2 px-4 text-start">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-start">
                        <tr className="hover:bg-[#123f7b]/10">
                            <td className="py-2 px-4">one</td>
                            <td className="py-2 px-4">two</td>
                            <td className="py-2 px-4">three</td>
                            <td className="py-2 px-4">four</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </AdminLayout>  
    );
}

export default indexPolice;