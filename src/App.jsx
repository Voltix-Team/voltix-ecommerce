import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Layout/Footer';

function App() {
  return (
    <BrowserRouter>
      {/* This main wrapper keeps the footer at the bottom without overlapping */}
      <div className="min-h-screen flex flex-col bg-slate-100">
        
        {/* Your friend's Navbar will go here later */}

        <main className="flex-grow flex items-center justify-center p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} /> 
          </Routes>
        </main>

        <Footer /> 
      </div>
    </BrowserRouter>
  );
}

export default App;