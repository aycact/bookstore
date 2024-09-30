// Danh sách mã tỉnh, thành phố hợp lệ
const validProvinces = [
  '001',
  '002',
  '004',
  '006',
  '008',
  '010',
  '011',
  '012',
  '014',
  '015',
  '017',
  '019',
  '020',
  '022',
  '024',
  '025',
  '026',
  '027',
  '030',
  '031',
  '033',
  '034',
  '035',
  '036',
  '037',
  '038',
  '040',
  '042',
  '044',
  '045',
  '046',
  '048',
  '049',
  '051',
  '052',
  '054',
  '056',
  '058',
  '060',
  '062',
  '064',
  '066',
  '067',
  '068',
  '070',
  '072',
  '074',
  '075',
  '077',
  '079',
  '080',
  '082',
  '083',
  '084',
  '086',
  '087',
  '089',
  '091',
  '092',
  '093',
  '094',
  '095',
  '096',
]

// Hàm kiểm tra tính hợp lệ của CCCD
function isValidCCCD(cccd) {
  // Kiểm tra độ dài là 12 chữ số
  if (!/^\d{12}$/.test(cccd)) {
    return false
  }

  // Tách các phần của CCCD
  const provinceCode = cccd.substring(0, 3) // 3 chữ số đầu là mã tỉnh
  const genderCode = parseInt(cccd[3]) // 1 chữ số tiếp theo là mã giới tính và thế kỷ
  const birthYearCode = cccd.substring(4, 6) // 2 chữ số tiếp theo là mã năm sinh
  const randomCode = cccd.substring(6) // 6 chữ số cuối là số ngẫu nhiên

  // Kiểm tra mã tỉnh có hợp lệ hay không
  if (!validProvinces.includes(provinceCode)) {
    return false
  }

  // Kiểm tra mã giới tính và mã thế kỷ
  let birthCentury
  if (genderCode === 0 || genderCode === 1) {
    birthCentury = 1900 // Thế kỷ 20
  } else if (genderCode === 2 || genderCode === 3) {
    birthCentury = 2000 // Thế kỷ 21
  } else if (genderCode === 4 || genderCode === 5) {
    birthCentury = 2100 // Thế kỷ 22
  } else if (genderCode === 6 || genderCode === 7) {
    birthCentury = 2200 // Thế kỷ 23
  } else if (genderCode === 8 || genderCode === 9) {
    birthCentury = 2300 // Thế kỷ 24
  } else {
    return false // Mã giới tính không hợp lệ
  }

  // Kiểm tra năm sinh
  const birthYear = birthCentury + parseInt(birthYearCode)
  if (birthYear > new Date().getFullYear() || birthYear < 1900) {
    return false
  }

  // Nếu tất cả các điều kiện đều hợp lệ, trả về true
  return true
}

module.exports = isValidCCCD
