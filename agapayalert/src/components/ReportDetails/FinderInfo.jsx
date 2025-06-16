import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { verifyFinderReport, deleteFinderReport } from "@/redux/actions/finderActions";
import toastUtils from "@/utils/toastUtils";
import { GoClock } from "react-icons/go";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

const STATUS_COLORS = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Verified: "bg-green-100 text-green-800 border-green-200",
    "False Report": "bg-red-100 text-red-800 border-red-200",
    Assigned: "bg-blue-100 text-blue-800 border-blue-200",
    "Under Investigation": "bg-blue-200 text-blue-900 border-blue-300",
    Resolved: "bg-green-50 text-green-700 border-green-100",
};

const FILTER_OPTIONS = [
    { label: "All", value: "" },
    { label: "Pending", value: "Pending" },
    { label: "Verified", value: "Verified" },
    { label: "False Report", value: "False Report" },
];

function VerificationModal({ open, onClose, report, onVerify }) {
    const [status, setStatus] = useState("Verified");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (open) {
            setStatus("Verified");
            setNotes("");
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!notes.trim()) {
            toastUtils("Please add verification notes", "error");
            return;
        }
        setLoading(true);
        try {
            const result = await onVerify(report._id, { status, verificationNotes: notes });
            if (result.success) {
                toastUtils(`Finder report ${status.toLowerCase()} successfully`, "success");
                onClose();
            } else {
                toastUtils(result.error || "Failed to verify report", "error");
            }
        } catch (error) {
            toastUtils("Error verifying report", "error");
            console.error("Verification error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!open || !report) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Verify Finder Report</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Report Summary</div>
                        <div className="text-sm text-gray-600 mb-1">
                            Finder: {report.finder?.firstName} {report.finder?.lastName}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                            Discovery Date: {report.discoveryDetails?.dateAndTime ? new Date(report.discoveryDetails.dateAndTime).toLocaleString() : "N/A"}
                        </div>
                        <div className="text-sm text-gray-600">
                            Location: {report.discoveryDetails?.location?.address?.streetAddress}, {report.discoveryDetails?.location?.address?.barangay}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-2 block">Verification Status</label>
                        <div className="flex gap-2">
                            {["Verified", "False Report"].map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    className={`flex-1 py-2 rounded border ${status === option ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}`}
                                    onClick={() => setStatus(option)}
                                    disabled={loading}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-2 block">Verification Notes*</label>
                        <textarea
                            className="w-full border rounded p-2"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add your verification notes here..."
                            rows={3}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-200"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded text-white ${loading ? "bg-blue-300" : "bg-blue-600"}`}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Verify"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FinderReportCard({ report, onVerify, onDelete }) {
    const statusClass = STATUS_COLORS[report.status] || STATUS_COLORS.Pending;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="font-semibold text-gray-900 mb-1">
                        Finder: {report.finder?.firstName} {report.finder?.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                        Report ID: {report._id.slice(-6)}
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-medium ${statusClass}`}>
                    {report.status}
                </div>
            </div>
            <div className="mb-3">
                <div className="flex items-center mb-1 text-sm text-gray-600">
                    <GoClock className="mr-2" />
                    {report.discoveryDetails?.dateAndTime
                        ? new Date(report.discoveryDetails.dateAndTime).toLocaleString()
                        : "N/A"}
                </div>
                <div className="flex items-center mb-1 text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    {report.discoveryDetails?.location?.address?.streetAddress}, {report.discoveryDetails?.location?.address?.barangay}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🧑</span>
                    Condition: {report.personCondition?.physicalCondition?.substring(0, 50)}...
                </div>
            </div>
            {report.images && report.images.length > 0 && (
                <div className="flex mb-3">
                    {report.images.slice(0, 3).map((image, idx) => (
                        <img
                            key={idx}
                            src={image.url}
                            alt={`Finder Report Image ${idx + 1}`}
                            className="w-12 h-12 rounded-lg mr-2 border border-gray-200 object-cover"
                        />
                    ))}
                    {report.images.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{report.images.length - 3}</span>
                        </div>
                    )}
                </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}
                </span>
                <div className="flex gap-2">
                    {report.status === "Pending" && (
                        <button
                            className="bg-blue-600 px-3 py-1.5 rounded-lg text-white text-xs font-medium flex items-center gap-1"
                            onClick={() => onVerify(report)}
                        >
                            <FaCheckCircle /> Verify
                        </button>
                    )}
                    <button
                        className="bg-red-100 px-3 py-1.5 rounded-lg text-red-600 text-xs font-medium flex items-center gap-1"
                        onClick={() => onDelete(report)}
                    >
                        <FaTrash /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export const FinderInfo = ({ finderReports }) => {
    const dispatch = useDispatch();
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const handleVerifyPress = (report) => {
        setSelectedReport(report);
        setShowVerificationModal(true);
    };

    const handleVerifyReport = async (reportId, verificationData) => {
        const result = await dispatch(verifyFinderReport(reportId, verificationData));
        if (result.success) {
            toastUtils("Report verified successfully", "success");
        }
        return result;
    };

    const handleDeletePress = (report) => {
        if (window.confirm("Are you sure you want to delete this finder report? This action cannot be undone.")) {
            handleDeleteReport(report._id);
        }
    };

    const handleDeleteReport = async (reportId) => {
        try {
            const result = await dispatch(deleteFinderReport(reportId));
            if (result.success) {
                toastUtils("Finder report deleted successfully", "success");
            } else {
                toastUtils(result.error || "Failed to delete report", "error");
            }
        } catch {
            toastUtils("Error deleting report", "error");
        }
    };

    return (
        <div>
            <div className="flex flex-col w-full place-items-center p-4">
                <div className="w-full max-w-3xl">
                    {finderReports.finderReports && finderReports.finderReports.length > 0 ? (
                        finderReports.finderReports.map((report) => (
                            <FinderReportCard
                                key={report._id}
                                report={report}
                                onVerify={handleVerifyPress}
                                onDelete={handleDeletePress}
                            />
                        ))
                    ) : (
                        <p className="text-[#123F7B] text-md font-semibold">No Finder Reports</p>
                    )}
                </div>
            </div>
            <VerificationModal
                open={showVerificationModal}
                onClose={() => {
                    setShowVerificationModal(false);
                    setSelectedReport(null);
                }}
                report={selectedReport}
                onVerify={handleVerifyReport}
            />
        </div>
    );
};