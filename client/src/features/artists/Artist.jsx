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
  console.log("this is the data we get", data)
  const imgUrl = new URL(`../../assets/images/a${data.profile_img}.png`, import.meta.url).href
  console.log(imgUrl)

  return (
    <div className='single-artist'>
      <div className='top'>
        <div className='left'>
          <img src={imgUrl} />
        </div>
        <div className='right'>
          <h2>{data.fullname}</h2>
          <p>{data.description}</p>
        </div>


      </div>
      <div className='bottom'>
        {data.isOwner
          ? <button onClick={() => { setIsPosting(true) }}>Add product</button>
          : null}
        {isPosting
          ? <ProductForm setIsPosting={setIsPosting} />
          : null
        }
        {isError
          ? <>Oh noes something broke!</>
          : isLoading || isFetching
            ? <>Loading products...</>
            : data.products.map(product => {
              if (product.active) {
                return (
                  <div style={{ order: product.id }} key={product.id}>

                    <ArtistProduct product={product} isOwner={data.isOwner} />
                  </div>
                )
              }
            })
        }
      </div>
    </div>
  )
}

export default Artist
