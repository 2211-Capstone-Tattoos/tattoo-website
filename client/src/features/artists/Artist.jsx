import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetArtistQuery } from '../../api/shopAPI'
import ProductForm from '../products/ProductForm'

const Artist = () => {
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError } = useGetArtistQuery(id)
  const [isEditable, setIsEditable] = useState()
  const [isPosting, setIsPosting] = useState()

  return (
    <div className='single-artist'>
      <div className='top'>
        <div className='left'>
          <img src={data.profile_img} />
        </div>
        <div className='right'></div>
        <h2>{data.fullname}</h2>
        <p>Lorem ipsum blah blah blah blah whatever this is the artist description</p>

        
      </div>
      <div className='bottom'>
        <button onClick={() => {setIsPosting(true)}}>Add product</button>
        { isPosting
          ? <ProductForm setIsPosting={setIsPosting}/>
          : null
        }
        { isError
          ? <>Oh noes something broke!</>
          : isLoading || isFetching
            ? <>Loading products...</>
            :data.products.map(product => {
              if (product.active) {
                return (
                <form onSubmit={null} className='product-card' key={product.id}>
                  <Link to={`/products/${product.id}`}><img src={product.img} alt="product-image" /></Link>
                  <Link to={`/products/${product.id}`}>
                    <label htmlFor="product-title">Title: </label>
                    <input type='text' defaultValue={product.title} disabled={!isEditable} />
                  </Link>
                  <div>
                    <label htmlFor="product-description">Description: </label>
                    <input type="text" defaultValue={product.description} disabled={!isEditable}/>
                  </div>
                  <div>
                    <label htmlFor="product-price">Price: </label>
                    <input type="text" defaultValue={product.price} disabled={!isEditable}/>
                  </div>
                  <p>{product.active ? 'true' : 'false'}</p>
                  {
                  data.isOwner
                  ? isEditable 
                    ? <button type='button' onClick={() => {setIsEditable(false)}}>Close Edit</button>
                    : <button type='button' onClick={() => {setIsEditable(true)}}>Edit</button>
                  : null 
                  }
                </form>
                )  
              }
            })
        }
      </div>
    </div>
  )
}

export default Artist
