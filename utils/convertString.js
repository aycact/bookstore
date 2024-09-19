function removeVietnameseTones(str) {
  str = str.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
  str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e')
  str = str.replace(/i|í|ì|ỉ|ĩ|ị/g, 'i')
  str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o')
  str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u')
  str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/Á|À|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ/g, 'A')
  str = str.replace(/É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, 'E')
  str = str.replace(/I|Í|Ì|Ỉ|Ĩ|Ị/g, 'I')
  str = str.replace(/Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g, 'O')
  str = str.replace(/Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, 'U')
  str = str.replace(/Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  return str
}

function convertToSlug(str) {
  str = str.toLowerCase() // Chuyển tất cả chữ hoa thành chữ thường
  str = removeVietnameseTones(str) // Bỏ dấu tiếng Việt
  str = str.replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
  str = str.replace(/[^a-z0-9\-]/g, '') // Loại bỏ các ký tự không hợp lệ
  str = str.replace(/-+/g, '-') // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang duy nhất
  str = str.replace(/^-+|-+$/g, '') // Loại bỏ dấu gạch ngang ở đầu và cuối chuỗi
  return str
}

module.exports = convertToSlug
