import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Shop from './pages/Shop';
import Quiz from './pages/Quiz';
import ProductDetails from './pages/ProductDetails';
import ClustaCare from './pages/ClustaCare';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/clusta-care" element={<ClustaCare />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQ />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
