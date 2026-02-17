const Input = ({ label, className = "", ...props }) => (
  <div>
    {label && <label className="label">{label}</label>}
    <input {...props} className={`input ${className}`.trim()} />
  </div>
);

export default Input;
