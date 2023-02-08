import React from 'react'
import { useGetAllArtistsQuery } from '../../api/shopAPI'
import { Link } from 'react-router-dom'
import './Artists.css'

const Artists = () => {
  const { data = [], isLoading, isFetching, isError } = useGetAllArtistsQuery()

  return (
    <div className="artists">
      <h2>Meet Our Artists</h2>
      {
        isError
          ? <>Oh noes something broke!</>
          : isLoading || isFetching
            ? <>Loading artists...</>
            : data.map(artist => {
              if(!artist.deleted) {
                const imgUrl = new URL(`../../assets/images/a${artist.profile_img}.png`, import.meta.url).href

                return (
                  <div className="artist-summary-container" key={artist.id}>
                    <div className="artist-aside">
                      <div className="artist-aside-text">
                        <h2><Link to={`/artists/${artist.id}`}>{artist.fullname}</Link></h2>
                        <span>{artist.location}</span>
                        <p>- {artist.description}</p>
                      </div>
                      <div className="artist-overview-thumbnails">{
                        artist.products?.map((product, index) => {
                          if (index > 2) {
                            return
                          }
                          const imgUrl = new URL(`../../assets/images/${product.img}.png`, import.meta.url).href
                          return (
                            <Link to={`/products/${product.id}`} key={product.id}>
                              <img src={imgUrl} alt="product-image" className="artist-thumbnail" />
                            </Link>
                          )
                        })
                      } 
                      </div>
                    </div>
                    <Link to={`/artists/${artist.id}`} ><img src={imgUrl} /></Link>
                  </div>
                  
                )
              }
            })
      }
    </div>
  )
}

export default Artists
