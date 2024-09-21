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
          title={'Sách'}
          description={description}
        />
        {/* card 2 */}
        <FlipCard
          IconComponent={FaRegEye}
          title={'Bạn đọc'}
          description={description}
        />
        {/* card 3 */}
        <FlipCard
          IconComponent={GiBullseye}
          title={'Nhà sách'}
          description={description}
        />
      </div>
    </div>
  )
}
export default AspirationSegment
