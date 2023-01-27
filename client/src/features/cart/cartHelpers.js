// State management helpers. Mutates state, localStorage, and handles API mutations
import { useDispatch, useSelector } from "react-redux"
import { useAddProductToCartMutation, useClearCartMutation, usePatchCartProductQuantityMutation, useRemoveProductMutation } from "../../api/shopAPI"
import { loadCart } from "./cartSlice"

const dispatch = useDispatch()
const cartSelector = useSelector((state) => state.cart) //will this update outside of a component?
const user = useSelector((state) => state.user)
const [APIaddProduct] = useAddProductToCartMutation()
const [APIeditQuantity] = usePatchCartProductQuantityMutation()
const [APIremoveProduct] = useRemoveProductMutation()
const [APIclearCart] = useClearCartMutation()


const updateCartStorage = (cart) => {
  window.localStorage.setItem('cart', JSON.stringify(cart))
}

export const addProductToCart = (product) => {
  dispatch(addProductToCart(product))
  updateCartStorage(cartSelector)
  if (user) {
    const APIdata = {
      userId: user.id,
      productId: product.id,
      body: {
        quantity : product.quantity
      }
    }
    APIaddProduct(APIdata)
  }
}

export const editCartProductQuantity = (newCartState) => {
  dispatch(loadCart(newCartState))
  updateCartStorage(cartSelector)
  if (user) {
    const APIdata = {
      userId: user.id,
      body: {} //need to figure out db func.
    }
    APIeditQuantity(APIdata)
  }
}

export const removeProductFromCart = (product) => {
  dispatch(removeProductFromCart(product))
  updateCartStorage(cartSelector)
  if (user) {
    const APIdata = {
      userId: user.id,
      productId: product.id
    }
    APIremoveProduct(APIdata)
  }
}

export const clearCart = () => {
  dispatch(clearCart())
  updateCartStorage(cartSelector)
  if (user) {
    APIclearCart(user.id)
  }
}
