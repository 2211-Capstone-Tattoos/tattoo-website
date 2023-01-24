import React from 'react'
import { useGetAllArtistsQuery } from '../../api/shopAPI'
import { Link } from 'react-router-dom'

const Artists = () => {
  const { data = [], isLoading, isFetching, isError } = useGetAllArtistsQuery()

  return (
    <div className="artists">
      {
        isError
          ? <>Oh noes something broke!</>
          : isLoading || isFetching
            ? <>Loading artists...</>
            : data.map(artist => {
              return (
                <div className="product-card" key={artist.id}>
                  <Link to={`/artists/${artist.id}`}>{artist.fullname}</Link>
                  <img src={artist.profile_img} />
                </div>
              )

            })
      }
    </div>
  )
}

export default Artists
