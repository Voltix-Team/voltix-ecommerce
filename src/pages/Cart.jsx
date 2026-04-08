import { useState } from 'react';
import  '../styles/style-cart.css'
import logo from '../assets/Logo.png'
export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <nav >
        <ul>
            <li><img src={logo} alt="logo" /></li>
            <li>Audio</li>
            <li>Computing</li>
            <li>Mobile</li>
            <li>Vision</li>
            <li>Gaming</li>
            <li>Deals</li>
            <li>
                <span>cart</span>
            </li>
            <li>
                <span>profile-pic</span>
            </li>
        </ul>
    </nav>
    
  )
}
