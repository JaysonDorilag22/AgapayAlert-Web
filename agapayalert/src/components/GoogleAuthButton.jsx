import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { googleAuth } from "../redux/actions/authActions";
import toastUtils from "@/utils/toastUtils";

const adminRoles = ['police_officer', 'police_admin', 'city_admin', 'super_admin'];

export default function GoogleAuthButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Decode the JWT to get user info
      const userInfo = jwt_decode(credentialResponse.credential);

      // Dispatch your redux action
      const result = await dispatch(googleAuth({ userInfo }));

      if (result.success) {
        toastUtils('Logged in successfully');
        if (result.data.exists) {
          navigate(adminRoles.includes(result.data.user.roles[0]) ? '/admin/dashboard' : '/');
        } else {
          navigate('/register', {
            state: {
              email: result.data.user.email,
              firstName: result.data.user.firstName,
              lastName: result.data.user.lastName,
              avatar: result.data.user.avatar,
            }
          });
        }
      } else {
        toastUtils(result.error || "Google sign-in failed", "error");
      }
    } catch (error) {
      toastUtils(error.message || "Google sign-in failed", "error");
    }
  };

  const handleError = () => {
    toastUtils("Google sign-in was cancelled or failed", "error");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      width="100%"
      useOneTap
    />
  );
}