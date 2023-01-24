import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetArtistQuery } from '../../api/shopAPI'

const Artist = () => {
  const { data = [], isLoading, isFetching, isError } = useGetArtistQuery(id)

  const { id } = useParams()
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

      </div>
    </div>
  )
}

export default Artist
