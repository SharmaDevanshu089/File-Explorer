import { useEffect } from "react";
import "./toast.css";
export function Toast({ ToastDet }) {
  //handleclose,duration,type,message
  useEffect(() => {
    const timer = setTimeout(ToastDet.handleClose, ToastDet.duration);
    return () => clearTimeout(timer);
  }, [ToastDet.duration, ToastDet.handleClose]);

  return (
    <div
      className={`toast-banner ${ToastDet.type === "error" ? "error" : "normal"}`}
    >
      <label>{ToastDet.message}</label>
    </div>
  );
}
