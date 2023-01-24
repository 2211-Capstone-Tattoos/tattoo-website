import { useRef } from 'react'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetArtistQuery } from '../../api/shopAPI'
import ProductForm from '../products/ProductForm'
import ArtistProduct from './ArtistProduct'

const Artist = () => {
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError } = useGetArtistQuery(id)
  const [isPosting, setIsPosting] = useState()

  return (
    <div className='single-artist'>
      <div className='top'>
        <div className='left'>
          <img src={data.profile_img} />
        </div>
        <div className='right'>
          <h2>{data.fullname}</h2>
          <p>Lorem ipsum blah blah blah blah whatever this is the artist description</p>
        </div>

        
      </div>
      <div className='bottom'>
        {data.isOwner 
        ? <button onClick={() => {setIsPosting(true)}}>Add product</button>
        : null}
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
                  <ArtistProduct product={product} isOwner={data.isOwner} key={product.id}/>
                )  
              }
            })
        }
      </div>
    </div>
  )
}

export default Artist
