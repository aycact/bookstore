import Badge from 'react-bootstrap/esm/Badge'
import { GiTiedScroll, GiBullseye } from 'react-icons/gi'
import { FaRegEye } from 'react-icons/fa'
import FlipCard from '../FlipCard'
import styled from 'styled-components'
import { boldTextColor, primaryBgColor, quaternaryBgColor, quaternaryBgColorLight, textColor } from '../../assets/js/variables'

const AspirationSegment = () => {
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
            'Độc giả'
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

const Wrapper = styled.section`
  body {
    margin-top: 4rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.75;
    background-color: ${quaternaryBgColor};
    color: ${textColor};
    position: relative;
  }

  p {
    margin-bottom: 1.5rem;
    max-width: 40em;
    color: ${textColor};
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    color: ${textColor};
  }

  .divider {
    color: ${primaryBgColor};
    width: 100%;
    font-size: 3rem;
    text-align: center;
    text-shadow: 2px 2px 3px rgb(180, 176, 176);
    height: 60px;
    line-height: 2rem;
    top: 28.75rem;
  }

  .segment {
    padding-top: 30px;
    padding-bottom: 80px;
  }

  .segmentX {
    padding: 80px 0;
    background-color: ${quaternaryBgColorLight};
  }

  .segmentX .segment-heading {
    margin-bottom: 3.5rem;
    text-transform: uppercase;
    letter-spacing: 0.25rem;
    font-weight: bold;
    color: ${primaryBgColor};
  }

  .segmentX .segment-heading .badge {
    background-color: ${primaryBgColor} !important;
    color: var(--quaternary-bg-color-light);
  }

  .segment-heading {
    color: ${primaryBgColor};
    font-family: var(--bodyFont);
    font-weight: 500;
    text-shadow: 2px 2px 3px rgb(180, 176, 176);
    font-size: 2rem;
    letter-spacing: 1px;
  }

  .breadcrumb {
    margin: 5rem 5rem 2rem;
  }

  .breadcrumb .breadcrumb-item {
    font-size: 2rem;
    font-weight: bold;
  }

  .breadcrumb .active {
    color: ${boldTextColor};
  }

  .breadcrumb a {
    text-decoration: none;
    color: ${textColor};
  }
`