import React, { useState, useEffect } from "react";

function UpdateNormalUserModal({
  open,
  onClose,
  title,
  onSubmit,
  submitLoading,
  formData,
  setFormData,
}) {
  const [avatarPreview, setAvatarPreview] = useState(formData.avatarPreview || null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(f => ({ ...f, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
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
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : formData.avatarUrl ? (
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
                disabled
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
              {submitLoading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateNormalUserModal;