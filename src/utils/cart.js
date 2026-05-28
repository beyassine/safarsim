const CART_KEY = 'cart'
const CART_EVENT = 'cart-updated'

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch (error) {
    return []
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent(CART_EVENT))
}

export function getCartCount() {
  const cart = getCart()
  return cart.reduce((total, item) => total + (item.quantity || 1), 0)
}

export function getCartTotal() {
  const cart = getCart()
  return cart.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1))
  }, 0)
}

export function addToCart(itemToAdd) {
  const cart = getCart()

  const existing = cart.find(
    (item) =>
      item.destinationSlug === itemToAdd.destinationSlug &&
      item.planKey === itemToAdd.planKey
  )

  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({
      ...itemToAdd,
      quantity: itemToAdd.quantity || 1,
    })
  }

  saveCart(cart)
}

export function removeFromCart(itemId) {
  const cart = getCart().filter((item) => item.id !== itemId)
  saveCart(cart)
}

export function increaseQuantity(itemId) {
  const cart = getCart()
  const item = cart.find((item) => item.id === itemId)

  if (item) {
    item.quantity += 1
    saveCart(cart)
  }
}

export function decreaseQuantity(itemId) {
  const cart = getCart()
  const item = cart.find((item) => item.id === itemId)

  if (!item) return

  if (item.quantity > 1) {
    item.quantity -= 1
  } else {
    const index = cart.findIndex((entry) => entry.id === itemId)
    if (index !== -1) cart.splice(index, 1)
  }

  saveCart(cart)
}

export function clearCart() {
  saveCart([])
}

export const CART_UPDATED_EVENT = CART_EVENT