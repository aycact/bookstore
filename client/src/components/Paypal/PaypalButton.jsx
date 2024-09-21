const PaypalButton = ({ initialOptions, key }) => {
  return (
    <PayPalScriptProvider options={initialOptions} key={JSON.stringify(values)}>
      <PayPalButtons
        style={{
          shape: 'rect',
          layout: 'vertical',
          color: 'gold',
          label: 'paypal',
        }}
        createOrder={createPaypalOrder}
        onApprove={approvePaypalOrder}
      />
    </PayPalScriptProvider>
  )
}
export default PaypalButton