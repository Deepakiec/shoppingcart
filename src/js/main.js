
'use strict';
let productData=[
    {"name":"item1", "actualPrice":"200", "discount":"10" },
    {"name":"item2", "actualPrice":"250", "discount":"15" },
    {"name":"item3", "actualPrice":"320", "discount":"5" },
    {"name":"item4", "actualPrice":"500", "discount":"25" },
    {"name":"item5", "actualPrice":"150", "discount":"5" },
    {"name":"item6", "actualPrice":"700", "discount":"22" }
];
let displayItems=[];
for(var i=0; i < productData.length; i++) {
    displayItems.push(`<div class="product">
    
    
    <div class="price_container">
    <input type="hidden" id="discountValue" value="${productData[i].discount}"/>
    <span class="discount">`+productData[i].discount+`% off</span>
    <img class="product__image" src="../images/products/item-`+[i+1]+`.png" alt=`+productData[i].name+`/>
    <div class="product_wrap">
    <span class="product__name">`+productData[i].name+`</span>
    <div class="footer__cnt">
    <div class="price__wrap">
    <span class="discount__strike">
    <span class="discount__price">`+productData[i].actualPrice+`</span>
    </span>
<span><b>$`+(productData[i].actualPrice-((productData[i].actualPrice*productData[i].discount)/100))+`</b></span>
</div>
<button class="btn btn--primary" data-action="ADD_TO_CART">Add To Cart</button>
</div>
</div>
    </div>
   
    </div>`)
}

const productDOM=document.querySelector('#product_items');
productDOM.insertAdjacentHTML('beforeend',
displayItems.join(''));



let cart = (JSON.parse(localStorage.getItem('cart')) || []);
const cartDOM = document.querySelector('.cart');
const addToCartButtonsDOM = document.querySelectorAll('[data-action="ADD_TO_CART"]');

if (cart.length > 0) {
  cart.forEach(cartItem => {
    const product = cartItem;
    insertItemToDOM(product);
    countCartTotal();

    addToCartButtonsDOM.forEach(addToCartButtonDOM => {
      const productDOM = addToCartButtonDOM.parentNode.parentNode.parentNode;

      if (productDOM.querySelector('.product__name').innerText === product.name) {
        handleActionButtons(addToCartButtonDOM, product);
      }
    });

  });
}

addToCartButtonsDOM.forEach(addToCartButtonDOM => {
  addToCartButtonDOM.addEventListener('click', () => {
    const productDOM = addToCartButtonDOM.parentNode.parentNode.parentNode;
    const product = {
      image: productDOM.querySelector('.product__image').getAttribute('src'),
      name: productDOM.querySelector('.product__name').innerText,
      price: productDOM.querySelector('.discount__price').innerText,
      quantity: 1,
      discount:productDOM.querySelector('#discountValue').value
    };
    console.log(product);

    const isInCart = (cart.filter(cartItem => (cartItem.name === product.name)).length > 0);
    const itemHeadDOM=document.querySelector('.item__head');
    if (!isInCart) {
      insertItemToDOM(product);
      cart.push(product);
      itemHeadDOM.innerHTML='<div class="recent__Item">All Items <span class="item__added">'+product.name+ '&nbsp; is added to cart</span></div>';
      saveCart();
      handleActionButtons(addToCartButtonDOM, product);
    }
  });
});

function insertItemToDOM(product) {
  cartDOM.insertAdjacentHTML('beforeend', `
    <div class="cart__item">
    <img class="cart__item__image" src="${product.image}" alt="${product.name}">
    <span class="cart__item__name">${product.name}</span>
    <span class="" data-action="REMOVE_ITEM">&times;</span>
    <span class="" data-action="DECREASE_ITEM">&minus;</span>
    <span class="cart__item__quantity">${product.quantity}</span>
    <span class="" data-action="INCREASE_ITEM">&plus;</span>
    <h3 class="cart__item__price">${product.price}</h3>
    <input type="hidden" value="${product.discount}"/>
    <input type="hidden" id="latest_item" value="${product.name}"/>
  </div>
  `);

  addCartFooter();
}

function handleActionButtons(addToCartButtonDOM, product) {
  addToCartButtonDOM.innerText = 'In Cart';
  addToCartButtonDOM.disabled = true;

  const cartItemsDOM = cartDOM.querySelectorAll('.cart__item');
  cartItemsDOM.forEach(cartItemDOM => {
    if (cartItemDOM.querySelector('.cart__item__name').innerText === product.name) {
      cartItemDOM.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', () => increaseItem(product, cartItemDOM));
      cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').addEventListener('click', () => decreaseItem(product, cartItemDOM, addToCartButtonDOM));
      cartItemDOM.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', () => removeItem(product, cartItemDOM, addToCartButtonDOM));
    }
  });
}

function increaseItem(product, cartItemDOM) {
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      cartItemDOM.querySelector('.cart__item__quantity').innerText = ++cartItem.quantity;
      cartItemDOM.querySelector('.cart__item__price').innerText = cartItem.quantity*product.price;
      saveCart();
    }
  });
}

function decreaseItem(product, cartItemDOM, addToCartButtonDOM) {
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      if (cartItem.quantity > 1) {
        cartItemDOM.querySelector('.cart__item__price').innerText = parseInt(cartItemDOM.querySelector('.cart__item__price').innerText)-product.price;
        cartItemDOM.querySelector('.cart__item__quantity').innerText = --cartItem.quantity;
        saveCart();
      } else {
        removeItem(product, cartItemDOM, addToCartButtonDOM);
      }
    }
  });
}

function removeItem(product, cartItemDOM, addToCartButtonDOM) {
  cartItemDOM.classList.add('cart__item--removed');
  setTimeout(() => cartItemDOM.remove(), 250);
  cart = cart.filter(cartItem => cartItem.name !== product.name);
  saveCart();
  addToCartButtonDOM.innerText = 'Add To Cart';
  addToCartButtonDOM.disabled = false;

  if (cart.length < 1) {
    document.querySelector('.cart-footer').remove();
  }
}

function addCartFooter() {
  if (document.querySelector('.cart-footer') === null) {
    cartDOM.insertAdjacentHTML('afterend', `
      <div class="cart-footer">
      <table class="tableLayout">
      <tr><td style='display: block;
      width: 372px;'><b>Total</b></td></tr>
       <tr><td>Items(<span class="items__count"></span>):</td><td data-action="CHECKOUT"></td></tr>
      <tr><td>Discount:</td><td class="total__discount"></td></tr>
      <tr><td>Type Discount:</td><td>-$0</td></tr>
      <tr class="total__row"><td style="
      width: 372px;">Order Total:</td><td class='totalPrice'></td></tr>
      </table>
      </div>
    `);
    
  }
}

function countCartTotal() {
  let cartTotal = 0;
  let discountPrice=0;
  let totalQuantuty=0;
  cart.forEach(cartItem => cartTotal += cartItem.quantity * cartItem.price);
  cart.forEach(cartItem => discountPrice += (cartItem.quantity * cartItem.price*cartItem.discount)/100);
  cart.forEach(cartItem => totalQuantuty += cartItem.quantity);
  document.querySelector('[data-action="CHECKOUT"]').innerText = `$${cartTotal}`;
  document.querySelector('.totalPrice').innerText = `$${cartTotal-discountPrice}`;
  document.querySelector('.total__discount').innerText = `-$${discountPrice}`;
  document.querySelector('.items__count').innerText = `${totalQuantuty}`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  countCartTotal();
}
