import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tileblue from '../../assets/tilelogoblue.png';
import { updateUserDetails } from '../../redux/actions/userActions';
import toastUtils from '@/utils/toastUtils';
import ProfileLayout from '@/layouts/ProfileLayout';

const EditProfileCard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    number: user?.number || "",
    address: {
      streetAddress: user?.address?.streetAddress || "",
      barangay: user?.address?.barangay || "",
      city: user?.address?.city || "",
      zipCode: user?.address?.zipCode || "",
    },
    avatarUrl: user?.avatar?.url || "",
    avatar: undefined,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      number: user?.number || "",
      address: {
        streetAddress: user?.address?.streetAddress || "",
        barangay: user?.address?.barangay || "",
        city: user?.address?.city || "",
        zipCode: user?.address?.zipCode || "",
      },
      avatarUrl: user?.avatar?.url || "",
      avatar: undefined,
    });
    setAvatarPreview(null);
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(f => ({ ...f, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toastUtils("Please fill in all required fields", "error");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("number", formData.number);
    formDataToSend.append("address[streetAddress]", formData.address.streetAddress);
    formDataToSend.append("address[barangay]", formData.address.barangay);
    formDataToSend.append("address[city]", formData.address.city);
    formDataToSend.append("address[zipCode]", formData.address.zipCode);

    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    setLoading(true);
    const result = await dispatch(updateUserDetails(user._id, formDataToSend));
    setLoading(false);

    if (result.success) {
      toastUtils("Profile updated successfully", "success");
    } else {
      toastUtils(result.error, "error");
    }
  };

  return (
  <ProfileLayout>
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        className="relative w-[620px] h-[530px] mx-[10px] bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 overflow-hidden flex flex-col"
        onSubmit={handleUpdate}
        encType="multipart/form-data"
        style={{}}
      >
        <h2 className="text-2xl font-bold mb-4 text-center pt-8">Edit Profile</h2>
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="flex flex-col items-center mb-4">
            <label className="block font-semibold mb-1 text-[#123f7b]">Avatar</label>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-[#123f7b]">First Name</label>
              <input
                className="w-full border rounded p-2 text-[#123f7b]/60"
                value={formData.firstName}
                onChange={e => setFormData(f => ({ ...f, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[#123f7b]">Last Name</label>
              <input
                className="w-full border rounded p-2 text-[#123f7b]/60"
                value={formData.lastName}
                onChange={e => setFormData(f => ({ ...f, lastName: e.target.value }))}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-1 text-[#123f7b]">Email</label>
              <input
                className="w-full border rounded p-2 text-[#123f7b]/60"
                type="email"
                value={formData.email}
                onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                required
                disabled
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-1 text-[#123f7b]">Phone Number</label>
              <input
                className="w-full border rounded p-2 text-[#123f7b]/60"
                value={formData.number}
                onChange={e => setFormData(f => ({ ...f, number: e.target.value }))}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-1 text-[#123f7b]">Street Address</label>
              <input
                className="w-full border rounded p-2 text-[#123f7b]/60"
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
              <label className="block font-semibold mb-1 text-[#123f7b]">Barangay</label>
              <input
                className="w-full border rounded p-2 text-[#123f7b]/60"
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
              <label className="block font-semibold mb-1 text-[#123f7b]">City</label>
              <input
                className="w-full border rounded p-2 text-[#123f7b]/60"
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
              <label className="block font-semibold mb-1 text-[#123f7b]">Zip Code</label>
              <input
                className="w-full border rounded p-2 text-[#123f7b]/60"
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
        </div>
        <div className="flex justify-end gap-2 mt-6 px-8 pb-8">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${loading ? "bg-blue-300" : "bg-blue-600"}`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  </ProfileLayout>
);
};

export default EditProfileCard;