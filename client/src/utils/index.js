export const formatPrice = (price) => {
  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format((price * 1000).toFixed(2))
  return VND
}

export const getCurrentDateTime = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0, nên cần cộng thêm 1
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  // Kết hợp các giá trị để tạo chuỗi theo chuẩn `YYYY-MM-DDTHH:mm`
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// export const generateAmountOption = (number) => {
//   const options = []
//   for (let i = 1; i <= number; i++) {
//     options.push(
//       <option key={i} value={i}>
//         {i}
//       </option>
//     )
//   }
//   return options
// }
