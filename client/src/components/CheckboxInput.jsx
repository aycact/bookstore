const CheckboxInput = ({ name, value, label, handleChange, checked }) => {
  return (
    <div className="form-check">
      <input
        name={name}
        className="form-check-input"
        type="checkbox"
        id={`checkbox-${value}`}
        onChange={handleChange}
        checked={checked}
      />
      <label className="form-check-label" htmlFor={`checkbox-${value}`}>
        {label}
      </label>
    </div>
  )
}
export default CheckboxInput
