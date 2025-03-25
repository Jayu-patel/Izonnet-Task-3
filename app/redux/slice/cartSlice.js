import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../utils/cartUtils";
import { toast } from "react-toastify";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: []};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const index = state.cartItems.findIndex(i=> i._id === action.payload._id)
      console.log(index)
      if(index >= 0){
        if(state.cartItems[index].quantity >= action.payload.countInStock){
          toast.error(`${action.payload.name} is out of stock`,{
            position: "top-center"
          })
          return
        }
      }
      if(index >= 0){
          state.cartItems[index].quantity += 1
          toast.info(`Increased ${state.cartItems[index].name} quantity`,{
            position: "top-center"
        })
      }
      else{
          const temp = {...action.payload}
          state.cartItems.push(temp)
          toast.success(`${action.payload.name} added to cart`,{
            position: "top-center"
          })
      }
      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload._id);
      toast.error(`${action.payload.name} is removed`,{
        position: "top-center"
      })
      return updateCart(state);
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => {state.cartItems = []},

    add(state,action){
      const index = state.cartItems.findIndex(i=> i._id === action.payload._id)
      if(state.cartItems[index].quantity >= action.payload.countInStock){
        toast.error(`${action.payload.name} is out of stock`,{
          position: "top-center"
        })
        return
      }
      if(index >= 0){
          state.cartItems[index].quantity += 1
      }
      else{
          const temp = {...action.payload}
          state.cartItems.push(temp)
      }
      return updateCart(state);
    },

    decrese(state,action){
      const index = state.cartItems.findIndex(i=> i._id === action.payload._id)
      if(state.cartItems[index].quantity > 1){
          state.cartItems[index].quantity -= 1
      }
      else if(state.cartItems[index].quantity === 1){
          const next = state.cartItems.filter((i)=> i._id !== action.payload._id)
          state.cartItems = next
      }
      return updateCart(state);
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCartItems,
  resetCart,
  add,
  decrese,
} = cartSlice.actions;

export default cartSlice.reducer;