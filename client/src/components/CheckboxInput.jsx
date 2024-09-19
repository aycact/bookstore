const CheckboxInput = ({ name, value, label, handleChange }) => {
  return (
    <div className="form-check">
      <input
        name={name}
        className="form-check-input"
        type="checkbox"
        id={`checkbox-${value}`}
        onChange={handleChange}
      />
      <label className="form-check-label" htmlFor={`checkbox-${value}`}>
        {label}
      </label>
    </div>
  )
}
export default CheckboxInput
