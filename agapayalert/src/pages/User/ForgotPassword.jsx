import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { forgotPassword, clearAuthMessage, clearAuthError } from "@/redux/actions/authActions";
import toastUtils from "@/utils/toastUtils";
import logo from "@/assets/AGAPAYALERT.svg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Required"),
});

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleForgotPassword = async (values, { setSubmitting }) => {
    const result = await dispatch(forgotPassword(values.email));
    setSubmitting(false);

    if (result.success) {
      toastUtils("Reset password link sent successfully");
      navigate("/reset-password", { state: { email: values.email } });
      dispatch(clearAuthMessage());
    } else {
      toastUtils(result.error || "Failed to send reset link", "error");
      dispatch(clearAuthError());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src={logo} alt="AGAPAYALERT" className="h-20 mb-6" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#123F7B] mb-2 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleForgotPassword}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-[#123F7B]">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full border rounded p-2 text-[#123F7B]/60"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#123F7B] text-white font-semibold py-2 rounded-xl mt-2"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}