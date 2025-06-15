import { toast } from "sonner";

let isToastVisible = false;

const toastUtils = (message, type = "default", duration = 2000) => {
  if (!message) {
    console.warn("Toast message cannot be empty");
    return;
  }
  if (!isToastVisible) {
    isToastVisible = true;
    toast[type](String(message), { duration });
    setTimeout(() => {
      isToastVisible = false;
    }, duration);
  }
};

export default toastUtils;