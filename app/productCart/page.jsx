"use client"
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, add, decrese } from "../redux/slice/cartSlice";
import { useRouter } from "next/navigation";

export default function ProductCart() {
  const cart = useSelector((state) => state.cart);
  const {userInfo} = useSelector(state => state?.auth) || ""
  const {cartItems} = cart
  const router = useRouter()
  const dispatch = useDispatch()

  const checkout=()=>{
    if(!userInfo){
      router.push("/login")
    }
    else{
      router.push("/checkout")
    }
  }
  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 small:py-6 medium:py-8">
      <div className="mx-auto px-2 small:px-4 medium:px-6 large:px-8">
        <h1 className="text-2xl small:text-3xl medium:text-4xl font-extrabold text-gray-800 mb-4 small:mb-6">
          Shopping Cart
        </h1>
        <div className="bg-white shadow-xl rounded-lg p-4 small:p-6 medium:p-8">
          {cartItems.length === 0 ? (
            <p className="text-base small:text-lg text-gray-500">Your cart is empty.</p>
          ) : (
            <div>
              {/* Table for large screens */}
              <div className="hidden large:block overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-xs medium:text-sm leading-normal">
                      <th className="py-2 px-4 medium:py-3 medium:px-6 text-left">Product</th>
                      <th className="py-2 px-4 medium:py-3 medium:px-6 text-center">Quantity</th>
                      <th className="py-2 px-4 medium:py-3 medium:px-6 text-center">Price</th>
                      <th className="py-2 px-4 medium:py-3 medium:px-6 text-center">Total</th>
                      <th className="py-2 px-4 medium:py-3 medium:px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-xs medium:text-sm divide-y divide-gray-200">
                    {cartItems?.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 medium:py-4 medium:px-6 flex items-center space-x-3 medium:space-x-4">
                          <img
                            src={item.image ?? ""}
                            alt={item.name}
                            className="w-12 h-12 medium:w-16 medium:h-16 object-cover rounded-lg shadow-md"
                          />
                          <div>
                            <h2 className="font-semibold text-gray-800">{item.name ?? ""}</h2>
                            <p className="text-gray-500 text-xs medium:text-sm">
                              ₹{item.price.toFixed(2) ?? ""}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 medium:py-4 medium:px-6 text-center">
                          <div className="flex justify-center items-center space-x-1 medium:space-x-2">
                            <button
                              onClick={() => dispatch(decrese(item))}
                              className="px-2 py-1 medium:px-3 medium:py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 medium:px-4 medium:py-1 bg-gray-100 border border-gray-200 text-gray-800 w-10 medium:w-12 text-center">
                              {item.quantity ?? ""}
                            </span>
                            <button
                              onClick={() => dispatch(add(item))}
                              className="px-2 py-1 medium:px-3 medium:py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 medium:py-4 medium:px-6 text-center">
                          ₹{item.price ?? ""}
                        </td>
                        <td className="py-3 px-4 medium:py-4 medium:px-6 text-center font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2) ?? ""}
                        </td>
                        <td className="py-3 px-4 medium:py-4 medium:px-6 text-center">
                          <button
                            onClick={() => dispatch(removeFromCart(item))}
                            className="px-3 py-1 medium:px-4 medium:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stacked layout for small and medium screens */}
              <div className="large:hidden space-y-4">
                {cartItems?.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image ?? ""}
                        alt={item.name}
                        className="w-16 h-16 small:w-20 small:h-20 object-cover rounded-lg shadow-md"
                      />
                      <div>
                        <h2 className="font-semibold text-gray-800 text-sm small:text-base">
                          {item.name ?? ""}
                        </h2>
                        <p className="text-gray-500 text-xs small:text-sm">
                          ₹{item.price.toFixed(2) ?? ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => dispatch(decrese(item))}
                          className="px-2 py-1 small:px-3 small:py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 small:px-4 small:py-1 bg-gray-100 border border-gray-200 text-gray-800 w-10 small:w-12 text-center text-sm">
                          {item.quantity ?? ""}
                        </span>
                        <button
                          onClick={() => dispatch(add(item))}
                          className="px-2 py-1 small:px-3 small:py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-gray-700 font-semibold text-sm small:text-base">
                        Total: ₹{(item.price * item.quantity).toFixed(2) ?? ""}
                      </p>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item))}
                      className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm small:text-base"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Total and Checkout */}
              <div className="text-right mt-4 small:mt-6">
                <h2 className="text-xl small:text-2xl font-bold text-gray-800">
                  Total: ₹{getTotalPrice().toFixed(2)}
                </h2>
                <button
                  className="mt-3 small:mt-4 px-4 py-2 small:px-6 small:py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition text-sm small:text-base"
                  onClick={() => checkout()}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}