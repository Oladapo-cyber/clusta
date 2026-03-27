import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PopularTestKits = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const filters = ['All', 'General Health', 'Sexual Health', 'Men', 'Women', 'Organ Health'];

  const products = [
    {
      id: 1,
      slug: 'diabetes',
      title: "Diabetes",
      description: "An at-home test that measures your average blood sugar (glucose) levels over the past 2-3 months to",
      price: "₦17,000",
      category: "General Health"
    },
    {
      id: 2,
      slug: 'stomach-ulcer',
      title: "Stomach Ulcer",
      description: "An at-home test to detect an active Helicobacter pylori (H. pylori) infection from a stool sample. H",
      price: "₦23,000",
      category: "General Health"
    },
    {
      id: 3,
      slug: 'hepatitis-b',
      title: "Hepatitis B",
      description: "An at-home rapid test that checks for Hepatitis B Surface Antigen (HBsAg) in a blood sample to deter",
      price: "₦9,900",
      category: "General Health"
    },
    {
      id: 4,
      slug: 'cardiac-health',
      title: "Cardiac health",
      description: "A rapid blood test that detects troponin, a protein released into the bloodstream when the heart muscle is damaged.",
      price: "₦25,000",
      category: "General Health"
    }
  ];

  return (
    <section className="py-16 px-4 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1344px]">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#101828] mb-3">
            Popular Test Kits
          </h2>
          <p className="font-body text-base text-[#575151]">
            Our most trusted and frequently used diagnostic tests
          </p>
        </div>

        {/* Category Filter Pills with Background Container */}
        <div className="bg-[#F5F5F5] rounded-2xl px-3 py-2 mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-2 rounded-xl font-body text-sm lg:text-base cursor-pointer font-bold transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-[#D1FAE5] text-[#101828]'
                    : 'bg-transparent text-[#575151] hover:bg-[#D1FAE5]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - 3 Cards on Desktop, Larger Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.slice(0, 3).map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Product Image Placeholder - Larger */}
              <div className="bg-[#E5E7EB] aspect-[4/3] flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-xs">
                    <p className="text-sm text-gray-600 mb-2 font-body">Product Image Placeholder</p>
                    <p className="text-xs text-gray-400 font-body">Replace with actual {product.title} test kit image</p>
                  </div>
                </div>
              </div>

              {/* Product Info - Larger Padding */}
              <div className="p-6 lg:p-7">
                <h3 className="font-body text-xl lg:text-2xl font-bold text-[#101828] mb-3">
                  {product.title}
                </h3>
                <p className="font-body text-sm lg:text-base text-[#575151] mb-6 leading-relaxed min-h-[3.5rem]">
                  {product.description}
                </p>

                {/* Price and Cart Button Row */}
                <div 
                  className="flex items-center justify-center gap-4 cursor-pointer border-2 border-b border-gray-100 py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product.slug,
                      name: product.title,
                      price: product.price,
                      image: '/placeholder.png'
                    });
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xl lg:text-2xl font-bold text-[#101828]">
                      {product.price}
                    </span>
                  </div>
                  <button 
                    className="p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label="Add to cart"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="hidden xs:block md:hidden border-[#E5E7EB] border-2 px-2 mt-6 shadow" />
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/shop')}
            className="bg-[#45AAB8] hover:bg-[#3d98a5] cursor-pointer text-white font-body text-sm lg:text-base font-medium px-10 py-3.5 rounded-xl transition-colors shadow-md"
          >
            View All Test Kits
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularTestKits;
