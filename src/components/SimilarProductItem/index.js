import './index.css'

const SimilarProductItem = props => {
  const {similarDetails} = props
  const {imageUrl, title, price, brand, rating} = similarDetails

  return (
    <li className="similarItem">
      <img src={imageUrl} alt="similar product" className="image10" />
      <h1 className="titleS">{title}</h1>
      <p className="brandS">By {brand}</p>
      <div className="price-rating">
        <p className="price2">Rs {price}/- </p>
        <div className="ratingC">
          <p className="rating2">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star2"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
