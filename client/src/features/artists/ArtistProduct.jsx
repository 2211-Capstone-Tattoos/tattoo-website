import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useDeleteProductMutation, useUpdateProductMutation } from "../../api/shopAPI"

const ArtistProduct = ({ product, isOwner }) => {
  const [isEditable, setIsEditable] = useState()
  const [updateProduct] = useUpdateProductMutation()
  const [removeProduct] = useDeleteProductMutation()
  const artistId = JSON.parse(window.localStorage.getItem('user'))?.id

  //form refs
  const titleRef = useRef(product.title)
  const descRef = useRef(product.description)
  const priceRef = useRef(product.price)

  //might be weird to change
  const imgRef = useRef()

  async function handleUpdateProduct() {
    const body = {
      title: product.title,
      description: product.description,
      price: product.price
    }
    if (titleRef.current.value !== product.title) body.title = titleRef.current.value
    if (descRef.current.value !== product.description) body.description = descRef.current.value
    if (priceRef.current.value !== product.price) body.price = priceRef.current.value

    try {
      const updatedProduct = await updateProduct({
        artistId: artistId,
        productId: product.id,
        body
      })
      console.log(updatedProduct)
      setIsEditable(false)
    } catch (err) {
      throw err
    }

  }

  async function handleRemoveProduct() {
    try {
      const removedProduct = await removeProduct({
        artistId: artistId,
        productId: product.id
      })
      console.log(removedProduct)
    } catch (err) {
      throw err
    }

  }

  const imgUrl = new URL(`../../assets/images/${product.img}.png`, import.meta.url).href


  return (
    <form onSubmit={(e) => {
      e.preventDefault()

      handleUpdateProduct()
    }} className='product-card'>
      <Link to={`/products/${product.id}`}><img src={imgUrl} alt="product-image" /></Link>
      <div className={`row ${isEditable ? 'is-active' : ''}`}>
        {/* FIXME: <Link to={`/products/${product.id}`}></Link> */}
        <input type='text' ref={titleRef} defaultValue={product.title} disabled={!isEditable} />
      </div>
      <div className={`row ${isEditable ? 'is-active' : ''}`}>
        <textarea type="text" ref={descRef} defaultValue={product.description} disabled={!isEditable} />
      </div>
      <div className={`row ${isEditable ? 'is-active' : ''}`}>
        <input type="text" ref={priceRef} defaultValue={product.price} disabled={!isEditable} />
      </div>
      {
        isOwner
          ? isEditable
            ? <div className="buttons">
              <button type='button' onClick={() => { setIsEditable(false) }}>Close</button>
              <button type="button" onClick={() => { handleUpdateProduct() }}>Save</button>
              <button type="button" onClick={() => { handleRemoveProduct() }}>Delete</button>
            </div>
            : <div className="buttons">
              <button type='button' onClick={() => { setIsEditable(true) }}>Edit</button>
            </div>
          : null
      }
    </form>
  )
}

export default ArtistProduct