import React from 'react'
import { useGetAllArtistsQuery } from '../../api/shopAPI'
import './Artists.css'
import SingleArtist from './SingleArtist'

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
              if (!artist.deleted) {
                return (
                  <SingleArtist artist={artist} />
                )
              }
            })
      }
    </div>
  )
}

export default Artists
