import Badge from 'react-bootstrap/esm/Badge'
import { GiTiedScroll, GiBullseye } from 'react-icons/gi'
import { FaRegEye } from 'react-icons/fa'
import '../../assets/scss/Card.scss'
import FlipCard from '../FlipCard'

const AspirationSegment = () => {
    const description = "Some quick example text to build on the card title and make up the bulk of the card's content."
  return (
    <div className="segmentX d-flex flex-column align-items-center">
      <h3 className="mx-5 segment-heading">
        <Badge>Mục tiêu</Badge> của chúng tôi
      </h3>
      <div className="card-container ">
        {/* card 1 */}
        <FlipCard
          IconComponent={GiTiedScroll}
          title={'Sách báo'}
          description={
            'Chúng tôi mang đến những đầu sách chất lượng, phong phú về nội dung và đa dạng về thể loại, phục vụ mọi lứa tuổi và sở thích.'
          }
        />
        {/* card 2 */}
        <FlipCard
          IconComponent={FaRegEye}
          title={
            'Đọc giả'
          }
          description={'Xây dựng một cộng đồng đọc giả yêu sách, cùng nhau chia sẻ kiến thức và lan tỏa đam mê đọc sách đến mọi người.'}
        />
        {/* card 3 */}
        <FlipCard
          IconComponent={GiBullseye}
          title={'Sự gắn kết'}
          description={
            'Chúng tôi kết nối những tâm hồn yêu sách, tạo ra một không gian học hỏi và phát triển kiến thức bền vững.'
          }
        />
      </div>
    </div>
  )
}
export default AspirationSegment
