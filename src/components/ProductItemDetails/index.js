import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const initailsApiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    apiStatus: initailsApiStatus.initial,
    productsData: {},
    similarData: [],
  }

  componentDidMount() {
    this.getProducts()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    description: data.description,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
  })

  getProducts = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    this.setState({
      apiStatus: initailsApiStatus.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    console.log(response.ok)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      console.log(updatedData)
      const simalarUpdatedData = data.similar_products.map(each =>
        this.getFormattedData(each),
      )
      console.log(simalarUpdatedData)
      this.setState({
        productsData: updatedData,
        similarData: simalarUpdatedData,
        apiStatus: initailsApiStatus.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: initailsApiStatus.failure})
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  getProductDetails = () => {
    const {productsData, similarData, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      rating,
      totalReviews,
      availability,
    } = productsData

    return (
      <>
        <div className="detailsContainer">
          <div className="productDetailsContainer">
            <div className="imageContainer">
              <img src={imageUrl} alt="product" className="image5" />
            </div>
            <div className="detailsContainer">
              <h1 className="title22">{title}</h1>
              <p className="price">Rs {price}/- </p>
              <div className="rating-Review">
                <div className="ratingContainer">
                  <p className="rating66">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
                <p className="reviews">{totalReviews} Reviews</p>
              </div>
              <p className="description">{description}</p>
              <p className="available">
                <span className="available2">Available: </span>
                {availability}
              </p>
              <p className="brand">
                <span className="brand1">Brand: </span>
                {brand}
              </p>
              <hr className="line" />

              <div className="quantityContainer">
                <button
                  type="button"
                  className="button6"
                  onClick={this.onDecrement}
                  data-testid="minus"
                >
                  <BsDashSquare className="icon5" />
                </button>
                <p className="quantity">{quantity}</p>
                <button
                  type="button"
                  className="button6"
                  onClick={this.onIncrement}
                  data-testid="plus"
                >
                  <BsPlusSquare className="icon5" />
                </button>
              </div>
              <button className="button4" type="button">
                Add To Cart
              </button>
            </div>
          </div>

          <ul className="similarContainer">
            <h1 className="heading3">Similar Products</h1>
            {similarData.map(each => (
              <SimilarProductItem key={each.id} similarDetails={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="errorImage"
      />
      <h1 className="Error">Product Not Found</h1>
      <Link to="/products">
        <button className="buttonError" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  getApiStatusDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case initailsApiStatus.success:
        return this.getProductDetails()
      case initailsApiStatus.failure:
        return this.getFailureView()
      case initailsApiStatus.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="productDetailsContainer">
          {this.getApiStatusDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
