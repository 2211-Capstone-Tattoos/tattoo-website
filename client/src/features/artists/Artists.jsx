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
              const imgUrl = new URL(`../../assets/images/a${artist.profile_img}.png`, import.meta.url).href

              return (
                <div className="product-card" key={artist.id}>
                  <h2><Link to={`/artists/${artist.id}`}>{artist.fullname}</Link></h2>
                  <img src={imgUrl} />
                </div>
              )

            })
      }
    </div>
  )
}

export default Artists
