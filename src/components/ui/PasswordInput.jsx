import { useState } from "react";

const PasswordInput = ({ label, className = "", ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className={`input pr-16 ${className}`.trim()}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
