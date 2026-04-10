import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PRODUCTS, type Product } from '../data/products';
import { fetchProductById } from '../services/products';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | undefined>(() => (id ? PRODUCTS.find((item) => item.id === id) : undefined));
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  const productImages = (product?.images && product.images.length > 0
    ? product.images
    : product?.image
      ? [product.image]
      : []);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setProduct(undefined);
      setHasLoaded(true);
      return () => {
        isMounted = false;
      };
    }

    void fetchProductById(id).then((nextProduct) => {
      if (isMounted) {
        setProduct(nextProduct);
        setHasLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (productImages.length === 0) {
      setActiveImage('');
      return;
    }

    if (!activeImage || !productImages.includes(activeImage)) {
      setActiveImage(productImages[0]);
    }
  }, [activeImage, productImages]);

  if (hasLoaded && !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="font-body text-3xl font-bold text-[#000000] mb-4">Product Not Found</h1>
            <button
              onClick={() => navigate('/shop')}
              className="bg-[#45AAB8] hover:bg-[#3d98a5] text-white py-3 px-8 rounded-lg font-body font-semibold transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="font-body text-lg text-[#4B5563]">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        backendProductId: product.backendId,
        name: product.title,
        price: product.price,
        image: product.image
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-12 px-4 lg:py-16">
        <div className="container mx-auto max-w-6xl">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Product Image */}
            <div>
              <div className="bg-[#EDEDED] rounded-xl aspect-square overflow-hidden">
                <img
                  src={activeImage || product.image}
                  alt={`${product.title} test kit`}
                  className="w-full h-full object-cover"
                />
              </div>

              {productImages.length > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {productImages.slice(0, 3).map((imageUrl, index) => {
                    const isActive = imageUrl === activeImage;
                    return (
                      <button
                        key={`${imageUrl}-${index}`}
                        type="button"
                        onClick={() => setActiveImage(imageUrl)}
                        className={`overflow-hidden rounded-lg border-2 transition-colors ${
                          isActive ? 'border-[#45AAB8]' : 'border-transparent hover:border-[#9EDAE2]'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img src={imageUrl} alt={`${product.title} preview ${index + 1}`} className="h-24 w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Product Info */}
            <div className="flex flex-col justify-center">
              <h1 className="font-body text-3xl lg:text-4xl font-bold text-[#000000] mb-4">
                {product.title}
              </h1>
              
              <p className="font-body text-2xl font-semibold text-[#000000] mb-6">
                {product.price}
              </p>

              <p className="font-body text-base lg:text-lg text-[#4B5563] mb-8 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white py-4 px-6 rounded-xl font-body font-bold text-lg transition-colors shadow-md hover:shadow-lg"
              >
                Add to cart
              </button>

              {/* Back to Shop Link */}
              <button
                onClick={() => navigate('/shop')}
                className="mt-4 w-full text-[#45AAB8] hover:text-[#3d98a5] font-body font-semibold py-2 transition-colors"
              >
                ← Back to Shop
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
