import { toast } from "sonner";

let isToastVisible = false;

const toastUtils = (message, type = "message", duration = 2000) => {
  if (!message) {
    console.warn("Toast message cannot be empty");
    return;
  }
  // Only allow valid types
  const validTypes = ["success", "error", "info", "warning", "message"];
  const toastType = validTypes.includes(type) ? type : "message";
  if (!isToastVisible) {
    isToastVisible = true;
    if (toastType === "message") {
      toast(String(message), { duration });
    } else {
      toast[toastType](String(message), { duration });
    }
    setTimeout(() => {
      isToastVisible = false;
    }, duration);
  }
};

export default toastUtils;