import React from 'react'

const Home = () => {
  const imgUrl = new URL(`./assets/images/bg.jpg`, import.meta.url).href

  return (
    <div className="home">
      <div className="home-copy">flashsheet is for independent tattoo artists to thrive. By artists, for artists, we aim to decentralize social media's hold on creative practices and marketing. flashsheet allows enthusiasts to find local artists without the bs. No algorithms here. Our devoted artists run the site communally, approving new artists, supporting the scene, and holding trainings. See who's working in your area, nominate an artist you know, and get lost in the flash.</div>
      <div className="home-img"><img src={imgUrl}></img></div>
    </div>
  )
}

export default Home
