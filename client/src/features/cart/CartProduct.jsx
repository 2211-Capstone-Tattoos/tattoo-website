import { useRef } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const CartProduct = ({ product, editCartProductQuantity, removeProductFromCart }) => {
  const qtyRef = useRef()
  const cartSelector = useSelector((state) => state.cart)

  const handleQtyChange = () => {
    try {
      editCartProductQuantity(cartSelector.id, product.id, qtyRef.current.value)
    } catch (error) {
      throw error
    }
  }

  const imgUrl = new URL(`../../assets/images/${product.img}.png`, import.meta.url).href

  return (
    <>
      <img src={imgUrl} alt="product-image" />
      <div className="details">
        <div className="top">
          <Link to={`/products/${product.productId}`}><p>{product.title}</p></Link>
          <p>{product.price}</p>
        </div>
        <div className="bottom">
          <div>
            <label htmlFor="quantity">Quantity: </label>
            <input type='number' ref={qtyRef} defaultValue={product.quantity} />
          </div>
          <div className="cart-product-buttons">
            <button onClick={() => handleQtyChange()}>Edit quantity</button>
            <button onClick={() => { removeProductFromCart(product) }}>Remove</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CartProduct  