export const formatPrice = (price) => {
  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format((price * 1000).toFixed(2))
  return VND
}

export const formatVNTimeZoneDate = (datetime) => {
  const dateUTC = datetime

  // Chuyển đổi chuỗi thời gian thành đối tượng Date
  const date = new Date(dateUTC)

  // Định dạng lại thời gian theo múi giờ Việt Nam (GMT+7)
  const options = {
    timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }


  const formatter = new Intl.DateTimeFormat('vi-VN', options)
  const dateInVietnamTime = formatter.format(date)

  return dateInVietnamTime
}

export const ratingTitle = (rating) => {
  switch(rating) {
    case 1:
      return 'Rất không hài lòng'
    case 2:
      return 'Không hài lòng'
    case 3:
      return 'Bình thường'
    case 4:
      return 'Hài lòng'
    case 5:
      return 'Cực kì hài lòng'
    default:
      return 'Chưa đánh giá'
  }
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
