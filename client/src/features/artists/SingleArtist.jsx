import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'



const SingleArtist = ({ artist }) => {
  const [index, setIndex] = useState(0)
  const delay = 4000
  const imgUrl = new URL(`../../assets/images/a${artist.profile_img}.png`, import.meta.url).href
  const timeoutRef = useRef(null)
  const navigate = useNavigate()

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === artist.products.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="artist-summary-container" key={artist.id}>
      <div className="artist-details">

        <div className="artist-details-text">
          <h2><Link to={`/artists/${artist.id}`}>{artist.fullname}</Link></h2>
          <span>{artist.location}</span>
          <div className='small-artist-image'>
            <img onClick={() => navigate(`/artists/${artist.id}`)} src={imgUrl} />
          </div>
          <p>- {artist.description}</p>
        </div>

        <div className="slideshow">

          <div
            className="slideshow-slider"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
            {artist.products.map((product, index) => {
              const imgUrl = new URL(`../../assets/images/${product.img}.png`, import.meta.url).href
              return (
                <div
                  className="thumbnail"
                  key={index}>
                  <img onClick={() => navigate(`/products/${product.id}`)} src={imgUrl} alt="product-image" className="artist-thumbnail" />
                </div>)

            }
            )}
          </div>
          <div className="slideshowDots">
            {artist.products.map((_, idx) => (
              <div
                key={idx}
                className={`slideshowDot${index === idx ? " active" : ""}`}
                onClick={() => {
                  setIndex(idx);
                }}
              ></div>
            ))}
          </div>
        </div>
        <button>View All Work</button>
      </div>
      <div className='big-artist-image'>
        <img onClick={() => navigate(`/artists/${artist.id}`)} src={imgUrl} />
      </div>
    </div>

  )
}

export default SingleArtist
