import React, { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  getPoliceStations,
  createPoliceStation,
  updatePoliceStation,
  deletePoliceStation,
} from "@/redux/actions/policeStationActions";
import { getReports } from "@/redux/actions/reportActions";
import toastUtils from "@/utils/toastUtils";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding, FaFileAlt } from "react-icons/fa";

// Modal component for create/edit
function PoliceStationModal({
  open,
  onClose,
  title,
  onSubmit,
  submitLoading,
  formData,
  setFormData,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="mb-3">
            <label className="block font-semibold mb-1">Station Name</label>
            <input
              className="w-full border rounded p-2"
              value={formData.name}
              onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">City</label>
            <input
              className="w-full border rounded p-2"
              value={formData.city}
              onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Street Address</label>
            <input
              className="w-full border rounded p-2"
              value={formData.streetAddress}
              onChange={e => setFormData(f => ({ ...f, streetAddress: e.target.value }))}
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Barangay</label>
            <input
              className="w-full border rounded p-2"
              value={formData.barangay}
              onChange={e => setFormData(f => ({ ...f, barangay: e.target.value }))}
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Zip Code</label>
            <input
              className="w-full border rounded p-2"
              value={formData.zipCode}
              onChange={e => setFormData(f => ({ ...f, zipCode: e.target.value }))}
            />
          </div>
          {/* Image upload can be added here if needed */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200"
              onClick={onClose}
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${submitLoading ? "bg-blue-300" : "bg-blue-600"}`}
              disabled={submitLoading}
            >
              {submitLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const IndexPolice = () => {
  const dispatch = useDispatch();
  const {
    policeStations = [],
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useSelector((state) => state.policeStation);
    const reports = useSelector((state) => state.report?.reports) || [];

  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    streetAddress: "",
    barangay: "",
    zipCode: "",
  });

  useEffect(() => {
    dispatch(getPoliceStations());
    dispatch(getReports({ page: 1, limit: 1000 }));
  }, [dispatch]);

  // Filter stations
  const filteredStations = policeStations.filter((station) =>
    (station.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (station.address?.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (station.address?.barangay || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalStations = policeStations.length;
  const totalReports = reports.length;
  const stationReports = policeStations.map((station) => ({
    ...station,
    reportCount: reports.filter(
      (report) => report.assignedPoliceStation?._id === station._id
    ).length,
  }));

  // CRUD handlers
  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      streetAddress: "",
      barangay: "",
      zipCode: "",
    });
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.city.trim()) {
      toastUtils("Station name and city are required", "error");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("city", formData.city);
    formDataToSend.append(
      "address",
      JSON.stringify({
        streetAddress: formData.streetAddress,
        barangay: formData.barangay,
        city: formData.city,
        zipCode: formData.zipCode,
      })
    );
    const result = await dispatch(createPoliceStation(formDataToSend));
    if (result.success) {
      setShowCreateModal(false);
      resetForm();
      toastUtils("Police station created successfully", "success");
    } else {
      toastUtils(result.error, "error");
    }
  };

  const handleEdit = (station) => {
    setSelectedStation(station);
    setFormData({
      name: station.name || "",
      city: station.address?.city || "",
      streetAddress: station.address?.streetAddress || "",
      barangay: station.address?.barangay || "",
      zipCode: station.address?.zipCode || "",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.city.trim()) {
      toastUtils("Station name and city are required", "error");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("city", formData.city);
    formDataToSend.append(
      "address",
      JSON.stringify({
        streetAddress: formData.streetAddress,
        barangay: formData.barangay,
        city: formData.city,
        zipCode: formData.zipCode,
      })
    );
    const result = await dispatch(updatePoliceStation(selectedStation._id, formDataToSend));
    if (result.success) {
      setShowEditModal(false);
      setSelectedStation(null);
      resetForm();
      toastUtils("Police station updated successfully", "success");
    } else {
      toastUtils(result.error, "error");
    }
  };

  const handleDelete = async (station) => {
    if (window.confirm(`Are you sure you want to delete "${station.name}"?`)) {
      const result = await dispatch(deletePoliceStation(station._id));
      if (result.success) {
        toastUtils("Police station deleted successfully", "success");
      } else {
        toastUtils(result.error, "error");
      }
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-4">
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setShowCreateModal(true);
              resetForm();
            }}
          >
            <FaPlus /> Add Station
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg flex-1 flex items-center gap-3 border">
            <FaBuilding className="text-blue-600 text-2xl" />
            <div>
              <div className="text-gray-600 text-sm">Total Stations</div>
              <div className="text-xl font-bold">{totalStations}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg flex-1 flex items-center gap-3 border">
            <FaFileAlt className="text-green-600 text-2xl" />
            <div>
              <div className="text-gray-600 text-sm">Total Reports</div>
              <div className="text-xl font-bold">{totalReports}</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4 max-w-md">
          <FaSearch className="text-gray-400" />
          <input
            className="flex-1 ml-2 bg-transparent outline-none"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="w-full">
          <table className="min-w-full bg-white rounded-2xl px-2 shadow-[#123F7B]/25 shadow-lg overflow-hidden">
            <thead className="bg-[#123F7B] text-white">
              <tr>
                <th className="py-2 px-4 text-start">Name</th>
                <th className="py-2 px-4 text-start">Address</th>
                <th className="py-2 px-4 text-start">Reports</th>
                <th className="py-2 px-4 text-start">Action</th>
              </tr>
            </thead>
            <tbody className="text-start">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredStations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No police stations found
                  </td>
                </tr>
              ) : (
                filteredStations.map((station) => {
                  const reportCount =
                    stationReports.find((s) => s._id === station._id)?.reportCount || 0;
                  return (
                    <tr key={station._id} className="hover:bg-[#123f7b]/10">
                      <td className="py-2 px-4 font-semibold">{station.name}</td>
                      <td className="py-2 px-4">
                        {station.address?.streetAddress}, {station.address?.barangay}, {station.address?.city}
                      </td>
                      <td className="py-2 px-4">{reportCount}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                          onClick={() => handleEdit(station)}
                          disabled={updateLoading}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"
                          onClick={() => handleDelete(station)}
                          disabled={deleteLoading}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <PoliceStationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Police Station"
        onSubmit={handleCreate}
        submitLoading={createLoading}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Edit Modal */}
      <PoliceStationModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStation(null);
          resetForm();
        }}
        title="Edit Police Station"
        onSubmit={handleUpdate}
        submitLoading={updateLoading}
        formData={formData}
        setFormData={setFormData}
      />
    </AdminLayout>
  );
};

export default IndexPolice;