import React from "react";
import { useRef } from "react";

const PurchaseCart = () => {
    const nameRef = useRef();
    const addressRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const zipCodeRef = useRef();

    return (
        <div>
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
                <button>Purchase</button>
            </form>
        </div>
    )
}

export default PurchaseCart;