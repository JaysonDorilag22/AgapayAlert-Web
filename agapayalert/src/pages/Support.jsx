import React from "react";
import logo from "../assets/AGAPAYALERT.svg";

const Support = () => {
    return (
        <div className="h-screen">
            <div className="h-full w-full place-items-center">
                <div className="Container bg-[#123F7B] h-54 w-5/6 place-items-center rounded-3xl overflow-hidden content-center shadow-lg px-44 py-10">
                    <h1 className="text-white text-4xl pb-6 font-bold">Support</h1>
                    <p className="text-white text-lg">For any inquiries or concerns, please contact us at
                        <a href="mailto:agapayalert@gmail.com" className="text-[#FFD700] font-bold">
                            <span className="text-[#FFD700] font-bold"> AgapayAlert Support</span>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Support;
