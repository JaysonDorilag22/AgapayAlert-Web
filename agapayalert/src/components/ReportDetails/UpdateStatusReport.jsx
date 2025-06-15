import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { FaUserCheck, FaCircleCheck } from "react-icons/fa6";
import { PiDetectiveFill } from "react-icons/pi";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { IoArchiveOutline } from "react-icons/io5";

const STATUS_STEPS = [
  {
    key: "Pending",
    label: "Pending",
    color: "#F4C430",
    icon: <GrInProgress className="w-6 h-6" />,
    bg: "bg-[#F4C430]/10 border-4 border-[#F4C430]",
    text: "text-[#F4C430]",
    glow: "shadow-[0_0_10px_2px_rgba(244,196,48,0.4)]"
  },
  {
    key: "Assigned",
    label: "Assigned",
    color: "#2D9CDB",
    icon: <FaUserCheck className="w-6 h-6" />,
    bg: "border-4 border-[#2D9CDB]",
    text: "text-[#2D9CDB]",
    glow: "shadow-[0_0_10px_2px_rgba(45,156,219,0.3)]"
  },
  {
    key: "Under Investigation",
    label: "Investigating",
    color: "#F2994A",
    icon: <PiDetectiveFill className="w-6 h-6" />,
    bg: "border-4 border-[#F2994A]",
    text: "text-[#F2994A]",
    glow: "shadow-[0_0_10px_2px_rgba(242,153,74,0.3)]"
  },
  {
    key: "Resolved",
    label: "Resolved",
    color: "#27AE60",
    icon: <HiOutlineDocumentCheck className="w-6 h-6" />,
    bg: "border-4 border-[#27AE60]",
    text: "text-[#27AE60]",
    glow: "shadow-[0_0_10px_2px_rgba(39,174,96,0.3)]"
  },
  {
    key: "Transferred",
    label: "Transferred",
    color: "#BDBDBD",
    icon: <IoArchiveOutline className="w-6 h-6" />,
    bg: "bg-[#717171]/10 border-4 border-[#BDBDBD]",
    text: "text-[#BDBDBD]",
    glow: "shadow-[0_0_10px_2px_rgba(189,189,189,0.2)]"
  },
];

export const UpdateStatusReport = ({ onClose, onSubmit, currentStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [followUp, setFollowUp] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === selectedStatus);

  const handleStatusClick = (idx) => {
    if (STATUS_STEPS[idx].key === selectedStatus) return;
    if (idx > currentIdx + 1) {
      const skipped = idx - currentIdx - 1;
      setConfirmMsg(
        `Are you sure you want to skip ${skipped} step${skipped > 1 ? "s" : ""}?`
      );
      setShowConfirm(true);
      setPendingStatus(STATUS_STEPS[idx].key);
    } else if (idx === 2 && currentIdx < 1) {
      setConfirmMsg(
        "You must assign a police officer before marking as Investigating. Are you sure you want to skip?"
      );
      setShowConfirm(true);
      setPendingStatus(STATUS_STEPS[idx].key);
    } else {
      setConfirmMsg(`Are you sure you want to set the status to ${STATUS_STEPS[idx].label}?`);
      setShowConfirm(true);
      setPendingStatus(STATUS_STEPS[idx].key);
    }
  };

  const handleConfirm = () => {
    setSelectedStatus(pendingStatus);
    setShowConfirm(false);
    setPendingStatus(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingStatus(null);
  };

  const handleSubmit = () => {
    if (!selectedStatus && !followUp.trim()) {
      setError("Status or follow-up note is required");
    }
    onSubmit({
      status: selectedStatus,
      followUp: followUp.trim(),
    });
    setFollowUp("");
    setError("");
  };

  return (
    <div className='flex flex-col place-items-center content-center justify-center pb-4 w-full h-full'>
      <div className='flex flex-row place-items-center justify-center w-full px-8'>
        <div
          className='flex flex-row place-items-center justify-center py-2 px-4 space-x-2 cursor-pointer hover:bg-[#123f7b]/15 hover:rounded-xl transition'
          onClick={onClose}
        >
          <FaArrowLeft className='w-6 h-6 text-[#123F7B]' />
          <p className='text-[#123F7B] text-md font-normal'>Go Back</p>
        </div>
      </div>
      <div className='flex flex-col place-items-center justify-center w-full h-full px-4 py-2 space-y-4'>
        <div className='flex flex-col place-items-start justify-start w-full h-full space-y-1'>
          <p className='text-[#123F7B] text-lg font-bold'>Update Report Status</p>
          <p className='text-[#123F7B] text-sm font-normal leading-4'>
            Update the progress of the report by selecting a status from the options below.<br />
            <span className="italic text-[#2D9CDB]">Each update will notify the reportee about the case.</span>
          </p>
        </div>
        <div className="flex flex-col place-items-center justify-center w-full h-full space-y-1">
          <div className="flex flex-col items-start content-center w-full h-full space-y-1">
            <div className='justify-start w-full'>
              <p className='text-start font-semibold'>Status Options</p>
            </div>
            <div className="flex flex-row w-full h-full place-items-end content-center justify-center relative">
              {STATUS_STEPS.map((step, idx) => {
                const isCurrent = step.key === selectedStatus;
                const isDone = idx < currentIdx;
                const isNotDone = idx > currentIdx;

                let borderClass = step.bg;
                let bgStyle = {};
                let textClass = step.text;
                let glow = "";
                let animateIcon = "";

                // Done: show check icon with #123F7B bg and color, subtle scale animation
                if (isDone) {
                  borderClass = "border-2 border-[#123F7B] bg-[#123F7B]";
                  bgStyle = {};
                  textClass = "text-[#123F7B] font-semibold";
                  glow = "";
                }
                // Not done: faded
                if (isNotDone) {
                  borderClass = "border-2 border-[#123F7B]";
                  bgStyle = { background: "transparent" };
                  textClass = "text-[#123F7B] font-semibold opacity-70";
                  animateIcon = "grayscale";
                }
                // Current: highlight
                if (isCurrent) {
                  textClass += " font-bold";
                  glow = step.glow + " shadow-lg";
                  animateIcon = "animate-pulse-slow";
                }

                return (
                  <React.Fragment key={step.key}>
                    <div
                      className={`flex flex-col w-24 h-max place-items-center content-center justify-center space-y-1 cursor-pointer group`}
                      onClick={() => handleStatusClick(idx)}
                    >
                      <div
                        className={`flex flex-col items-center justify-center w-max h-max ${borderClass} rounded-full transition-all duration-200 group-hover:scale-105 ${glow} ${animateIcon}`}
                        style={bgStyle}
                      >
                        {isDone ? (
                          <FaCircleCheck className="w-6 h-6 m-4 text-white" style={{ color: "#fff" }} />
                        ) : React.cloneElement(step.icon, {
                            className: `w-6 h-6 m-4 ${isCurrent ? "drop-shadow-lg" : ""}`,
                            color: isCurrent ? step.color : "#123F7B",
                          })}
                      </div>
                      <p className={`${textClass} text-xs text-center w-full break-words transition-all duration-200`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="mt-1 text-[10px] text-[#123F7B] bg-[#F4C430]/10 px-2 py-0.5 rounded-full font-semibold animate-pulse-slow shadow">
                          Current Step
                        </span>
                      )}
                    </div>
                    {/* Remove the line between Resolved and Transferred */}
                    {idx < STATUS_STEPS.length - 1 && !(step.key === "Resolved" && STATUS_STEPS[idx + 1].key === "Transferred") && (
                      <div className="flex flex-col w-8 h-0 justify-center items-center relative">
                        <div
                          className={
                            `absolute left-1/2 -top-9 -translate-x-1/2 border-t-2 w-10 ` +
                            (
                              idx < currentIdx
                                ? "border-[#123F7B] border-solid"
                                : idx === currentIdx
                                ? "border-[#123F7B] border-dashed animate-pulse"
                                : "border-[#123F7B] border-dashed opacity-50"
                            )
                          }
                          style={{ borderWidth: 4 }}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div className='flex flex-col items-start content-center w-full h-full space-y-1'>
            <div className='justify-start w-full'>
              <p className='text-start font-semibold'>Follow-up Notes</p>
            </div>
            <div className='flex flex-col w-full h-full space-y-2'>
              <textarea
                className='w-full h-20 border-2 border-[#123F7B] rounded-lg p-2 focus:ring-2 focus:ring-[#2D9CDB] transition'
                placeholder='Add any follow-up notes or comments here...'
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
              ></textarea>
              <p className='text-[#123F7B] text-xs font-normal leading-4'>
                Notes will be visible to the reportee and other users with access to this report.
              </p>
              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-row place-items-end justify-end w-full h-full'>
          <button
            className='bg-[#123F7B] text-white text-md font-semibold px-8 py-3 rounded-2xl shadow-lg hover:from-[#2D9CDB] hover:to-[#123F7B]'
            onClick={handleSubmit}
          >
            <span className="tracking-wide">Update</span>
          </button>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-xs w-full border-2 border-[#2D9CDB]">
            <p className="text-[#123F7B] mb-4 font-semibold">{confirmMsg}</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-gradient-to-r from-[#123F7B] to-[#2D9CDB] text-white font-semibold shadow hover:from-[#2D9CDB] hover:to-[#123F7B] transition"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateStatusReport;