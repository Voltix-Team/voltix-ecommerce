import { useState } from 'react';
import { ShoppingCart, User, Trash2, ShieldCheck, Truck, Minus, Plus } from 'lucide-react';

const CartPage = () => {
  const [CartItems, setCartItems] = useState([
    {
      id: 1,
      category: 'AUDIO MASTERY',
      name: 'Voltix Pro X1 Headphones',
      description: 'Space Grey / Titanium Core',
      price: 349.00,
      quantity: 1,
      image: 'https://placehold.co/100x100/1a1a1a/FFF?text=Headphones'
    },
    {
      id: 2,
      category: 'AUDIO MASTERY',
      name: 'Voltix Pro X1 Headphones',
      description: 'Space Grey / Titanium Core',
      price: 349.00,
      quantity: 1,
      image: 'https://placehold.co/100x100/1a1a1a/FFF?text=Headphones'
    },
    {
      id: 1,
      category: 'AUDIO MASTERY',
      name: 'Voltix Pro X1 Headphones',
      description: 'Space Grey / Titanium Core',
      price: 349.00,
      quantity: 1,
      image: 'https://placehold.co/100x100/1a1a1a/FFF?text=Headphones'
    }

  ]);
  const discount = 0;
  const subtotal = CartItems.reduce((sum,item)=>sum + item.price * item.quantity,0);
  const total = subtotal - discount;
  const handleQuantityChange = (id,value)=>{
    setCartItems(CartItems.map(item=>{
      if(item.id === id){
        const newQuntity = item.quantity + value;
        return {...item, quantity: newQuntity};
      }
    }))
  }
}

export default function Counter() {

  return (
    <div className=''>
      <nav>
        <div>Voltix</div>
        <div>
          <a href="#">ِAudio</a>
          <a href="#">Computing</a>
          <a href="#">Mobile</a>
          <a href="#">Vision</a>
          <a href="#">Gaming</a>
          <a href="#">Deals</a>
        </div>
        <div>
          <div>
            <ShoppingCart />
            <span></span>
          </div>
          <User></User>
        </div>
      </nav>
      <main>

      </main>
    </div>

  )
}
