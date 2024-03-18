import CircularProgress from "@mui/material/CircularProgress";
import cls from "./w2-button.module.css";

export const W2Button = ({
  children,
  disabled,
  onClick,
  type = "button",
  icon,
  loading = false,
  size = "medium",
  variant = 'primaryBtn',
  id,
}) => {
  return (
    <button
      id={id}
      type={type}
      className={`${cls[variant]} ${cls[size]} ${
        disabled ? cls.disabled : ""
      }`}
      disabled={disabled || loading}
      onClick={loading || onClick}
    >
      {!loading ? (
        <>
          {icon ? icon : ""}
          <span className={cls.text}>{children}</span>
        </>
      ) : (
        <CircularProgress color="inherit" size={22} />
      )}
    </button>
  );
};
