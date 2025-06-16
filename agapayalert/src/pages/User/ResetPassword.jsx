import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword, resendOtp, clearAuthMessage, clearAuthError } from "@/redux/actions/authActions";
import toastUtils from "@/utils/toastUtils";
import logo from "@/assets/AGAPAYALERT.svg";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const resetPasswordValidationSchema = Yup.object({
  otp: Yup.string().required("OTP is required"),
  newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
});

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);

  // Get email from navigation state
  const email = location.state?.email || "";

  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  const handleResetPassword = async (values, { setSubmitting }) => {
    const result = await dispatch(
      resetPassword({ email, otp: values.otp, newPassword: values.newPassword })
    );
    setSubmitting(false);

    if (result.success) {
      toastUtils('Password reset successfully');
      dispatch(clearAuthMessage());
      navigate('/'); // Redirect to login or home
    } else {
      toastUtils(result.error || "Failed to reset password", "error");
      dispatch(clearAuthError());
    }
  };

  const handleResendOtp = useCallback(async () => {
    const result = await dispatch(resendOtp(email));
    if (result.success) {
      setCountdown(60);
      setIsResendDisabled(true);
      toastUtils('OTP resent successfully');
      dispatch(clearAuthMessage());
    } else {
      toastUtils(result.error || "Failed to resend OTP", "error");
      dispatch(clearAuthError());
    }
  }, [dispatch, email]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src={logo} alt="AGAPAYALERT" className="h-20 mb-6" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#123F7B] mb-2 text-center">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the OTP sent to your email and your new password.
        </p>
        <Formik
          initialValues={{ otp: "", newPassword: "" }}
          validationSchema={resetPasswordValidationSchema}
          onSubmit={handleResetPassword}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-[#123F7B]">OTP</label>
                <Field
                  type="text"
                  name="otp"
                  className="w-full border rounded p-2 text-[#123F7B]/60"
                  placeholder="Enter OTP"
                />
                <ErrorMessage name="otp" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-[#123F7B]">New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  className="w-full border rounded p-2 text-[#123F7B]/60"
                  placeholder="Enter new password"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="text-sm text-center text-[#123F7B] mb-2">
                Didn't get the OTP?{" "}
                <button
                  type="button"
                  className={`underline ${isResendDisabled ? "text-gray-400 cursor-not-allowed" : "text-[#123F7B]"}`}
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                >
                  {isResendDisabled ? `Resend (${countdown}s)` : "Resend"}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#123F7B] text-white font-semibold py-2 rounded-xl mt-2"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}