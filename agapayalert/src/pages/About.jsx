import React from "react";
import logo from "../assets/AGAPAYALERT.svg";

const About = () => {
    return (
        <div className="h-screen">
            <div className="h-full w-full place-items-center">
                <div className="Container bg-[#123F7B] h-54 w-5/6 place-items-center rounded-3xl overflow-hidden content-center shadow-lg px-44 py-10">
                    <h1 className="text-white text-4xl pb-6 font-bold">About us</h1>
                    <p className="text-white text-lg">AgapayAlert is a web application that helps you keep track of your loved ones. It is designed to help you monitor the whereabouts of your family members, especially those who are vulnerable and may need assistance in case of emergencies. With AgapayAlert, you can easily report a missing person and get help from the community to locate them. You can also view reports submitted by other users and help find missing persons in your area.</p>
                </div>
            </div>
        </div>
    );
};

export default About;