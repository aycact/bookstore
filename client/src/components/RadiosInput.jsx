const RadiosInput = ({ name, value, handleCheck, label }) => {
  return (
    <div className="form-check">
      <input
        name={name}
        className="form-check-input"
        type="radio"
        value={value}
        id={`radio-${value}`}
        onChange={handleCheck}
      />
      <label className="form-check-label" htmlFor={`radio-${value}`}>
        {label}
      </label>
    </div>
  )
}
export default RadiosInput
