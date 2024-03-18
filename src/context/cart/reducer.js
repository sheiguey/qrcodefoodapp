import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
  HIDE_ORDER_LINK,
} from "./actions";

const cart_reducer = (state, action) => {
  if (action.type === ADD_TO_CART) {
    const { product } = action.payload;
    const tempItem = state.cart.find((i) => i.id === product.stock.id);
    if (tempItem) {
      const tempCart = state.cart.map((cartItem) => {
        if (cartItem.id === product.stock.id) {
          let newAmount = cartItem.stock.amount + product.min_qty;
          if (newAmount > cartItem.max_qty) {
            newAmount = cartItem.max_qty;
          }
          return {
            ...cartItem,
            stock: { ...cartItem.stock, amount: newAmount },
          };
        } else {
          return cartItem;
        }
      });

      return { ...state, cart: tempCart };
    } else {
      return {
        ...state,
        cart: [
          ...state.cart,
          {
            ...product,
            stock: {
              ...product.stock,
              amount: product.stock.amount || product.min_qty || 1,
            },
          },
        ],
      };
    }
  }

  if (action.type === REMOVE_CART_ITEM) {
    const tempCart = state.cart.filter(
      (item) => item.stock.id !== action.payload
    );
    return { ...state, cart: tempCart };
  }

  if (action.type === CLEAR_CART) {
    return { ...state, cart: [], showOrderLink: true };
  }

  if (action.type === HIDE_ORDER_LINK) {
    return { ...state, showOrderLink: false };
  }

  if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
    const { id, value } = action.payload;
    const tempCart = state.cart.map((item) => {
      if (item.stock.id === id) {
        if (value === "inc") {
          let newAmount = item.stock.amount + 1;
          if (newAmount > item.max) newAmount = item.max;
          return { ...item, stock: { ...item.stock, amount: newAmount } };
        }
        if (value === "dec") {
          let newAmount = item.stock.amount - 1;
          if (newAmount < 1) newAmount = 1;
          return { ...item, stock: { ...item.stock, amount: newAmount } };
        }
      } else {
        return item;
      }
    });

    return { ...state, cart: tempCart };
  }

  if (action.type === COUNT_CART_TOTALS) {
    const { total_items, total_amount, total_price } = state.cart.reduce(
      (total, item) => {
        const { stock } = item;

        total.total_items += stock.amount;
        total.total_amount += stock.total_price * stock.amount;
        total.total_price += stock.price * stock.amount;

        return total;
      },
      { total_items: 0, total_amount: 0, total_price: 0 }
    );
    return { ...state, total_items, total_amount, total_price };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
