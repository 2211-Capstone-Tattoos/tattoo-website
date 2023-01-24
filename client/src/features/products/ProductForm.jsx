import React from "react";
import { useRef } from "react";
import { useAddProductMutation } from "../../api/shopAPI";

const ProductForm = ({ setIsPosting }) => {
    const [addProduct] = useAddProductMutation();

    const titleRef = useRef()
    const descriptionRef = useRef();
    const priceRef = useRef();
    const imgRef = useRef();

    return (
        <div>
            Create a New Product
            <form onSubmit={async (e) => {
                e.preventDefault();
                const body = {
                    title: titleRef.current.value,
                    description: descriptionRef.current.value,
                    price: priceRef.current.value,
                    img: imgRef.current.value,
                }

                try {
                    const newProduct = await addProduct({
                        artistId: JSON.parse(window.localStorage.getItem('user')).id,
                        body
                    })
                    console.log(newProduct)
                    setIsPosting(false)
                } catch (error) {
                    throw error
                }
            }}>
                <div>
                    <label htmlFor="title">Title: </label>
                    <input type="text" ref={titleRef} required={true}/>
                </div>
                <div>
                    <label htmlFor="description">Description: </label>
                    <input type="text" ref={descriptionRef} required={true}/>
                </div>
                <div>
                    <label htmlFor="price">Price: </label>
                    <input type="text" ref={priceRef} required={true}/>
                </div>
                <div>
                    <label htmlFor="img">Image: </label>
                    <input type="text" ref={imgRef} required={true}/>
                </div>
                <button>Create!</button>
            </form>
        </div>
    )
}

export default ProductForm;