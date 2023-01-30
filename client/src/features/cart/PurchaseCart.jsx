import React from "react";
import { useRef } from "react";

const PurchaseCart = () => {
    const nameRef = useRef();
    const addressRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const zipCodeRef = useRef();

    return (
        <div className='purchase-cart'>
            <h2>Checkout</h2>
            <div className='container'>

                <div className='left'>
                    <div className='shipping'>
                        <h4>Shipping information:</h4>
                        <form>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input type="text" ref={nameRef} required={true}></input>
                            </div>
                            <div>
                                <label htmlFor="address">Address:</label>
                                <input type="text" ref={addressRef} required={true}></input>
                            </div>
                            <div>
                                <label htmlFor="city">City:</label>
                                <input type="text" ref={cityRef} required={true}></input>
                            </div>
                            <div>
                                <label htmlFor="name">State:</label>
                                <input type="text" ref={stateRef} required={true}></input>
                            </div>
                            <div>
                                <label htmlFor="name">ZIP Code:</label>
                                <input type="text" ref={zipCodeRef} required={true}></input>
                            </div>
                        </form>
                    </div>

                    <div className='shipping'>
                        <h4>Payment information:</h4>
                        <form>
                            <div>
                                <label htmlFor="name">Name On Card:</label>
                                <input type="text" ref={nameRef} required={true}></input>
                            </div>
                            <div>
                                <label htmlFor="card">Card Number:</label>
                                <input type="text" ref={addressRef} required={true}></input>
                            </div>
                            <div>
                                <label htmlFor="expiration">Expiration:</label>
                                <input type="text" ref={cityRef} required={true}></input>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='right'>
                    <h4>Order Summary:</h4>
                    <div>
                        <p>Items:</p>
                    </div>
                    <div>
                        <p>Shipping & handling:</p>
                    </div>
                    <div>
                        <p>Total before tax:</p>
                    </div>
                    <div>
                        <p>Tax to be collected:</p>
                    </div>
                    <div>
                        <h5>Order Total:</h5>
                    </div>
                    <button>Submit Order</button>
                </div>
            </div>
        </div>
    )
}

export default PurchaseCart;