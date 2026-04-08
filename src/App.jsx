import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Checkout from './pages/Checkout'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* This tells React: If the path is exactly "/", show the Checkout page */}
        <Route path="/" element={<Checkout />} />
        
        {/* This handles the /checkout URL specifically */}
        <Route path="/checkout" element={<Checkout />} />

        {/* Optional: Redirect any unknown URL back to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;