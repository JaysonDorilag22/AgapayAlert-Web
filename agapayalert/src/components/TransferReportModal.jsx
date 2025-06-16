import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getPoliceStations } from "@/redux/actions/policeStationActions";
import { transferReport } from "@/redux/actions/reportActions";

const TransferReportModal = ({ open, onClose, reportId, onTransferred }) => {
  const dispatch = useDispatch();
  const { policeStations, loading: stationsLoading } = useSelector(state => state.policeStation);

 const [formData, setFormData] = useState({
  recipientEmail: "",
  recipientDepartment: "", // <-- update field name
  includeImages: true,
  transferNotes: "" // <-- update field name
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && !policeStations.length && !stationsLoading) {
      dispatch(getPoliceStations());
    }
  }, [open, policeStations.length, stationsLoading, dispatch]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.recipientEmail || !formData.recipientEmail.includes("@")) {
        setError("Please enter a valid recipient email.");
        return;
    }
    setLoading(true);
    const transferData = {
        recipientEmail: formData.recipientEmail,
        recipientDepartment: formData.recipientDepartment, // <-- update field name
        includeImages: formData.includeImages,
        transferNotes: formData.transferNotes // <-- update field name
    };
    const result = await dispatch(transferReport(reportId, transferData));
    setLoading(false);
    if (result.success) {
        onTransferred && onTransferred();
        onClose();
    } else {
        setError(result.error || "Transfer failed.");
    }
    };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <h2 className="text-lg font-bold mb-2">Transfer Report</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Recipient Email *</label>
            <input
              type="email"
              name="recipientEmail"
              className="w-full border rounded p-2"
              value={formData.recipientEmail}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Police Station</label>
            <select
                name="recipientDepartment"
                className="w-full border rounded p-2"
                value={formData.recipientDepartment}
                onChange={handleChange}
                disabled={loading || stationsLoading}
            >
              <option value="">Select Station</option>
              {policeStations.map(station => (
                    <option key={station._id} value={station._id}>{station.name}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Include Media Files</label>
            <input
              type="checkbox"
              name="includeImages"
              checked={formData.includeImages}
              onChange={handleChange}
              disabled={loading}
            />{" "}
            Yes
          </div>
          <div>
            <label className="block text-sm mb-1">Transfer Note (optional)</label>
            <textarea
                name="transferNotes"
                className="w-full border rounded p-2"
                value={formData.transferNotes}
                onChange={handleChange}
                disabled={loading}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-[#123F7B] text-white" disabled={loading}>
              {loading ? "Transferring..." : "Transfer"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-xs text-gray-600">
          <b>Note:</b> This will transfer the report to another station and email the recipient. Media files will be included if checked.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferReportModal;