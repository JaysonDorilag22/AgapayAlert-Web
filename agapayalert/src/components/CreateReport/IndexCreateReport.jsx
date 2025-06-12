import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from '../ui/dialog';
import TUP from "../../assets/TUP.png";
import { FiUser } from "react-icons/fi";
import { CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";
import { TbPhoneCall } from "react-icons/tb";
import { CiBellOn } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { CiCircleAlert } from "react-icons/ci";
import AGAPAYALERTwhite from "../../assets/AGAPAYALERTwhite.svg";

const IndexCreateReport = ({ reportId, onClose, user }) => {
    const [selectedReportId, setSelectedReportId] = useState(null);

    const handleCloseModal = () => {
        setSelectedReportId(null);
    };
    
    return (
        <Dialog open={!!reportId} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-[1120px] sm:max-h-[980px]">
                <div className="flex flex-row p-4 overflow-auto max-h-[600px] space-x-2">
                    <div className="flex flex-col w-1/3 h-full bg-[#123f7b] rounded-3xl px-4 py-8 justify-between items-center">
                        <div className="flex flex-col items-center space-y-2">
                            <img src={AGAPAYALERTwhite} alt="Agapay Alert Logo" className="w-12 h-12 mx-auto" />
                            <p className="text-white text-lg font-semibold">Terms & Conditions</p>
                        </div>
                        {/* Div 2: Terms Explanation */}
                        <div className="flex flex-col items-center space-y-3 text-center">
                            <p className="text-white text-xs font-light">
                                By submitting a report, you agree to provide accurate and truthful information. False or misleading reports can delay real emergencies and may result in penalties.
                            </p>
                            <p className="text-white text-xs font-lgiht">
                                Please include as much detail as possible, such as location, time, and visual evidence. Stay calm, use clear language, and expect follow-up communication from authorities.
                            </p>
                        </div>
                        {/* Div 3: Stepper of 8 */}
                        <div className="flex flex-col items-center space-y-2">
                             <div className="flex flex-row items-center w-4/5 justify-center space-x-2">
                                {[...Array(8)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`
                                    h-2 rounded-full transition-all duration-200
                                    ${idx === 0 ? 'bg-[#D46A79] w-8' : 'bg-white w-4'}
                                    `}
                                />
                                ))}
                            </div>
                            <p className="text-white text-xs font-normal mt-2">Step 1 of 8</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-full space-y-2 h-full">
                        <div className="flex flex-col w-full h-full">
                            <div className="flex flex-col w-full h-full space-y-4">
                                <div className="flex flex-col w-4/5 h-full space-y-0.5">
                                    <p className="font-bold text-lg">Confirm Your Information</p>
                                    <p className="text-sm text-gray-500 leading-4">Please review your details below to make sure everything is correct. This helps us contact you if needed and ensures your report is accurate.</p>
                                </div>
                                <div className="flex flex-row w-full h-full space-x-2">
                                    <img
                                        src={user?.avatar?.url || TUP}
                                        alt={user?.firstName || "User"}
                                        className="w-40 h-40 object-cover rounded-lg"
                                    />
                                    <div className="flex flex-col space-y-2 w-full h-full">
                                        <div className="flex flex-row place-items-center space-x-1">
                                            <FiUser className="w-6 h-6 text-[#D46A79]" />
                                            <div className="flex flex-col -space-y-1">
                                                <p className="text-sm font-semibold text-[#123F7B]">{user?.firstName} {user?.lastName}</p>
                                                <p className="text-xs font-light text-[#D46A79]">Name</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row place-items-center space-x-1">
                                            <CiMail className="w-6 h-6 text-[#D46A79]" />
                                            <div className="flex flex-col -space-y-1">
                                                <p className="text-sm font-semibold text-[#123F7B]">{user?.email}</p>
                                                <p className="text-xs font-light text-[#D46A79]">Email</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row place-items-center space-x-1">
                                            <FiPhone className="w-6 h-6 text-[#D46A79]" />
                                            <div className="flex flex-col -space-y-1">
                                                <p className="text-sm font-semibold text-[#123F7B]">{user?.number}</p>
                                                <p className="text-xs font-light text-[#D46A79]">Contact Number</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row place-items-center space-x-1">
                                            <IoLocationOutline className="w-6 h-6 text-[#D46A79]" />
                                            <div className="flex flex-col -space-y-1">
                                                <p className="text-sm font-semibold text-[#123F7B]">
                                                {user?.address
                                                    ? `${user.address.streetAddress || ''}, ${user.address.barangay || ''}, ${user.address.city || ''}`
                                                    : ''}
                                                </p>
                                                <p className="text-xs font-light text-[#D46A79]">Address</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end place-items-center">
                                        <button>
                                            <FiEdit className="text-[#D46A79] w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <div>
                                <p className="font-bold text-lg">Important Reminders</p>
                            </div>
                            <div className="flex flex-col w-full h-full space-y-1 p-2">
                                <div className="flex flex-row space-x-1 bg-[#34A853]/10 p-2 rounded-lg place-items-center">
                                    <CiCircleCheck className="w-6 h-6 text-[#34A853]" />
                                    <p className="text-sm text-[#34A853] leading-4"><strong>Provide Accurate Information: </strong>Ensure details like the location, time, and description of the incident are correct. </p>
                                </div>
                                <div className="flex flex-row space-x-1 bg-[#DC2626]/10 p-2 rounded-lg place-items-center">
                                    <CiCircleAlert className="w-6 h-6 text-[#DC2626]" />
                                    <p className="text-sm text-[#DC2626] leading-4"><strong>Avoid False Reports: </strong>False or misleading reports can delay real emergencies—always be truthful. </p>
                                </div>
                                <div className="flex flex-row space-x-1 bg-[#2563EB]/10 p-2 rounded-lg place-items-center">
                                    <CiImageOn className="w-6 h-6 text-[#2563EB]" />
                                    <p className="text-sm text-[#2563EB] leading-4"><strong>Include Visual Evidence: </strong>Attach photos or videos if possible to help assess the situation better. </p>
                                </div>
                                <div className="flex flex-row space-x-1 bg-[#7C3AED]/10 p-2 rounded-lg place-items-center">
                                    <CiBellOn className="w-6 h-6 text-[#7C3AED]" />
                                    <p className="text-sm text-[#7C3AED] leading-4"><strong>Stay Calm and Clear: </strong>Use simple, concise language to describe the incident. </p>
                                </div>
                                <div className="flex flex-row space-x-1 bg-[#D97706]/10 p-2 rounded-lg place-items-center">
                                    <TbPhoneCall className="w-6 h-6 text-[#D97706]" />
                                    <p className="text-sm text-[#D97706] leading-4"><strong>Follow Up: </strong>Expect calls from authorities and monitor the app for updates. </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <button className="bg-[#123F7B] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#123F7B]/80 transition-colors duration-200 w-max self-end">
                                I understand, continue ➜
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
    }

export default IndexCreateReport;