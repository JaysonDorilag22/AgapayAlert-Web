import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { getUserList, createUserWithRole, updateUserDetails, deleteUser } from "@/redux/actions/userActions";
import { getPoliceStations } from "@/redux/actions/policeStationActions";
import toastUtils from "@/utils/toastUtils";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

// Modal component for create/edit user
function UserModal({
  open,
  onClose,
  title,
  onSubmit,
  submitLoading,
  formData,
  setFormData,
  policeStations,
  isEdit = false,
}) {
  const [avatarPreview, setAvatarPreview] = useState(formData.avatarPreview || null);

  // Handle file input change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(f => ({ ...f, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    // Reset preview when modal opens/closes or formData.avatar changes
    if (!formData.avatar) setAvatarPreview(null);
  }, [open, formData.avatar]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Avatar Upload */}
          <div className="mb-4 flex flex-col items-center">
            <label className="block font-semibold mb-1">Avatar</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mb-2"
            />
            {/* Show preview if new avatar is selected, else show existing avatar if editing */}
            {avatarPreview ? (
                <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border"
                />
            ) : isEdit && formData.avatar === undefined && formData.avatarPreview === undefined && formData.avatarUrl ? (
                <img
                src={formData.avatarUrl}
                alt="Current Avatar"
                className="w-20 h-20 rounded-full object-cover border"
                />
            ) : null}
            </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">First Name</label>
              <input
                className="w-full border rounded p-2"
                value={formData.firstName}
                onChange={e => setFormData(f => ({ ...f, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Last Name</label>
              <input
                className="w-full border rounded p-2"
                value={formData.lastName}
                onChange={e => setFormData(f => ({ ...f, lastName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                className="w-full border rounded p-2"
                type="email"
                value={formData.email}
                onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                required
                disabled={isEdit}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                className="w-full border rounded p-2"
                value={formData.number}
                onChange={e => setFormData(f => ({ ...f, number: e.target.value }))}
                required
              />
            </div>
            {!isEdit && (
              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                  className="w-full border rounded p-2"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
            )}
            <div>
              <label className="block font-semibold mb-1">Role</label>
              <select
                className="w-full border rounded p-2"
                value={formData.role}
                onChange={e => setFormData(f => ({ ...f, role: e.target.value }))}
                required
              >
                <option value="">Select Role</option>
                <option value="police_officer">Police Officer</option>
                <option value="police_admin">Police Admin</option>
                <option value="city_admin">City Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            {(formData.role === "police_officer" || formData.role === "police_admin") && (
              <>
                <div>
                  <label className="block font-semibold mb-1">Police Station</label>
                  <select
                    className="w-full border rounded p-2"
                    value={formData.policeStationId}
                    onChange={e => setFormData(f => ({ ...f, policeStationId: e.target.value }))}
                  >
                    <option value="">Select Police Station</option>
                    {policeStations.map(station => (
                      <option key={station._id} value={station._id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Rank</label>
                  <input
                    className="w-full border rounded p-2"
                    value={formData.rank}
                    onChange={e => setFormData(f => ({ ...f, rank: e.target.value }))}
                  />
                </div>
              </>
            )}
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Street Address</label>
              <input
                className="w-full border rounded p-2"
                value={formData.address.streetAddress}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    address: { ...f.address, streetAddress: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Barangay</label>
              <input
                className="w-full border rounded p-2"
                value={formData.address.barangay}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    address: { ...f.address, barangay: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">City</label>
              <input
                className="w-full border rounded p-2"
                value={formData.address.city}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    address: { ...f.address, city: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Zip Code</label>
              <input
                className="w-full border rounded p-2"
                value={formData.address.zipCode}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    address: { ...f.address, zipCode: e.target.value },
                  }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
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
              {submitLoading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const USER_ROLES = [
  { label: "All Roles", value: "" },
  { label: "Police Officer", value: "police_officer" },
  { label: "Police Admin", value: "police_admin" },
  { label: "City Admin", value: "city_admin" },
  { label: "Super Admin", value: "super_admin" },
];

const indexUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading } = useSelector((state) => state.user);
  const { policeStations = [] } = useSelector((state) => state.policeStation);

  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    number: "",
    role: "",
    policeStationId: "",
    rank: "",
    address: {
      streetAddress: "",
      barangay: "",
      city: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    const openModal = () => {
      setShowCreateModal(true);
      resetForm();
    };
    window.addEventListener('openCreateUserModal', openModal);
    return () => window.removeEventListener('openCreateUserModal', openModal);
  }, []);

  useEffect(() => {
    dispatch(getUserList({ page: 1, limit: 100, role: activeFilter, search: searchText }));
    dispatch(getPoliceStations());
  }, [dispatch, activeFilter, searchText]);

  // Filtered users
  const filteredUsers = users.filter(
    (user) =>
      (user.firstName + " " + user.lastName).toLowerCase().includes(searchText.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchText.toLowerCase())
  );

  // CRUD handlers
  const resetForm = () => {
    setFormData({
      avatarUrl: "",
      avatar: undefined,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      number: "",
      role: "",
      policeStationId: "",
      rank: "",
      address: {
        streetAddress: "",
        barangay: "",
        city: "",
        zipCode: "",
      },
    });
  };

  const handleCreate = async () => {
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
    toastUtils("Please fill in all required fields", "error");
    return;
  }
  const formDataToSend = new FormData();
  formDataToSend.append("firstName", formData.firstName);
  formDataToSend.append("lastName", formData.lastName);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("password", formData.password);
  formDataToSend.append("number", formData.number);
  formDataToSend.append("role", formData.role);
  if (formData.policeStationId) formDataToSend.append("policeStationId", formData.policeStationId);
  if (formData.rank) formDataToSend.append("rank", formData.rank);
  formDataToSend.append("address[streetAddress]", formData.address.streetAddress);
  formDataToSend.append("address[barangay]", formData.address.barangay);
  formDataToSend.append("address[city]", formData.address.city);
  formDataToSend.append("address[zipCode]", formData.address.zipCode);

  // Add avatar if present
  if (formData.avatar) {
    formDataToSend.append("avatar", formData.avatar);
  }

  const result = await dispatch(createUserWithRole(formDataToSend));
    if (result.success) {
      setShowCreateModal(false);
      resetForm();
      toastUtils("User created successfully", "success");
      dispatch(getUserList({ page: 1, limit: 100, role: activeFilter, search: searchText }));
    } else {
      toastUtils(result.error, "error");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      number: user.number || "",
      role: user.roles?.[0] || "",
      policeStationId: user.policeStation?._id || "",
      rank: user.rank || "",
      address: {
        streetAddress: user.address?.streetAddress || "",
        barangay: user.address?.barangay || "",
        city: user.address?.city || "",
        zipCode: user.address?.zipCode || "",
      },
      avatarUrl: user.avatar?.url || user.avatar || "", // <-- Add this line
        avatar: undefined,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
    toastUtils("Please fill in all required fields", "error");
    return;
  }
  const formDataToSend = new FormData();
  formDataToSend.append("firstName", formData.firstName);
  formDataToSend.append("lastName", formData.lastName);
  formDataToSend.append("email", formData.email);
  if (formData.password) formDataToSend.append("password", formData.password);
  formDataToSend.append("number", formData.number);
  formDataToSend.append("role", formData.role);
  if (formData.policeStationId) formDataToSend.append("policeStationId", formData.policeStationId);
  if (formData.rank) formDataToSend.append("rank", formData.rank);
  formDataToSend.append("address[streetAddress]", formData.address.streetAddress);
  formDataToSend.append("address[barangay]", formData.address.barangay);
  formDataToSend.append("address[city]", formData.address.city);
  formDataToSend.append("address[zipCode]", formData.address.zipCode);

  // Add avatar if present
  if (formData.avatar) {
    formDataToSend.append("avatar", formData.avatar);
  }

  const result = await dispatch(updateUserDetails(selectedUser._id, formDataToSend));
    if (result.success) {
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      toastUtils("User updated successfully", "success");
      dispatch(getUserList({ page: 1, limit: 100, role: activeFilter, search: searchText }));
    } else {
      toastUtils(result.error, "error");
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete "${user.firstName} ${user.lastName}"?`)) {
      const result = await dispatch(deleteUser(user._id));
      if (result.success) {
        toastUtils("User deleted successfully", "success");
        dispatch(getUserList({ page: 1, limit: 100, role: activeFilter, search: searchText }));
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
            <FaPlus /> Add User
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2 mb-4">
          {USER_ROLES.map((role) => (
            <button
              key={role.value}
              className={`px-4 py-2 rounded-full border text-sm font-medium ${
                activeFilter === role.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
              onClick={() => setActiveFilter(role.value)}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4 max-w-md">
          <FaSearch className="text-gray-400" />
          <input
            className="flex-1 ml-2 bg-transparent outline-none"
            placeholder="Search users..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="w-full">
          <table className="min-w-full bg-white rounded-2xl px-2 shadow-[#123F7B]/25 shadow-lg overflow-hidden">
            <thead className="bg-[#123F7B] text-white">
              <tr>
                <th className="py-2 px-4 text-start">Profile</th>
                <th className="py-2 px-4 text-start">Name</th>
                <th className="py-2 px-4 text-start">Email</th>
                <th className="py-2 px-4 text-start">Role</th>
                <th className="py-2 px-4 text-start">Station</th>
                <th className="py-2 px-4 text-start">Action</th>
              </tr>
            </thead>
            <tbody className="text-start">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#123f7b]/10">
                    <td className="py-2 px-4">
                      {user.avatar ? (
                        <img
                          src={user.avatar.url || user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">N/A</span>
                        </div>
                        )}
                    </td>
                    <td className="py-2 px-4 font-semibold">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      {(user.roles?.[0] || "")
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(" ")}
                    </td>
                    <td className="py-2 px-4">{user.policeStation?.name || "-"}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"
                        onClick={() => handleDelete(user)}
                        disabled={loading}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <UserModal
        open={showCreateModal}
        onClose={() => {
        setShowCreateModal(false);
        setFormData(f => ({ ...f, avatar: null }));
        setShowEditModal(false);
        setSelectedUser(null);
        resetForm();
        }}
        title="Create User"
        onSubmit={handleCreate}
        submitLoading={loading}
        formData={formData}
        setFormData={setFormData}
        policeStations={policeStations}
      />

      {/* Edit Modal */}
      <UserModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
          resetForm();
        }}
        title="Edit User"
        onSubmit={handleUpdate}
        submitLoading={loading}
        formData={formData}
        setFormData={setFormData}
        policeStations={policeStations}
        isEdit
      />
    </AdminLayout>
  );
};

export default indexUsers;