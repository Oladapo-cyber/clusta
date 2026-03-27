import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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
      category: "General Health",
      available: true
    },
    {
      id: 2,
      slug: 'stomach-ulcer',
      title: "Stomach Ulcer",
      description: "An at-home test to detect an active Helicobacter pylori (H. pylori) infection from a stool sample. H",
      price: "₦23,000",
      category: "General Health",
      available: true
    },
    {
      id: 3,
      slug: 'hepatitis-b',
      title: "Hepatitis B",
      description: "An at-home rapid test that checks for Hepatitis B Surface Antigen (HBsAg) in a blood sample to deter",
      price: "₦9,900",
      category: "General Health",
      available: true
    },
    {
      id: 4,
      slug: 'cardiac-health',
      title: "Cardiac health",
      description: "A rapid blood test that detects troponin, a protein released into the bloodstream when the heart muscle is damaged.",
      price: "₦25,000",
      category: "General Health",
      available: true
    },
    {
      id: 5,
      slug: 'typhoid',
      title: "Typhoid",
      description: "An at-home rapid test for detecting Salmonella typhi antibodies in blood samples.",
      price: "₦21,000",
      category: "General Health",
      available: true
    },
    {
      id: 6,
      slug: 'hiv',
      title: "HIV",
      description: "A confidential at-home test for detecting HIV antibodies in blood samples.",
      price: "₦8,000",
      category: "Sexual Health",
      available: true
    },
    {
      id: 7,
      slug: 'uti',
      title: "Urinary Tract Infection",
      description: "An at-home test to detect bacterial infections in the urinary tract.",
      price: "₦25,000",
      category: "General Health",
      available: true
    },
    {
      id: 8,
      slug: 'pregnancy',
      title: "Pregnancy",
      description: "A reliable at-home pregnancy test for early detection.",
      price: "₦9,570",
      category: "Women",
      available: true
    },
    {
      id: 9,
      slug: 'ovulation',
      title: "Ovulation",
      description: "Track your fertile window with this at-home ovulation test.",
      price: "₦9,900",
      category: "Women",
      available: true
    },
    {
      id: 10,
      slug: 'vaginal-ph',
      title: "Vaginal pH Infection",
      description: "Test for vaginal pH imbalance and potential infections at home.",
      price: "₦9,900",
      category: "Women",
      available: true
    },
    {
      id: 11,
      slug: 'gonorrhea',
      title: "Gonorrhea",
      description: "A confidential at-home test for detecting Gonorrhea infection.",
      price: "₦9,900",
      category: "Sexual Health",
      available: true
    },
    {
      id: 12,
      title: "Kidney",
      description: "Comprehensive kidney function test.",
      price: "Coming Soon",
      category: "Organ Health",
      available: false
    },
    {
      id: 13,
      title: "Prostate",
      description: "At-home prostate health screening test.",
      price: "Coming Soon",
      category: "Men",
      available: false
    }
  ];

  // Filter products based on category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeFilter === 'All' || product.category === activeFilter;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16 px-4 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1344px]">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[#101828] mb-3">
              Our Test Kits
            </h1>
            <p className="font-body text-base text-[#575151]">
              Professional-grade diagnostic tests for home use
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl bg-[#F5F5F5] border-none focus:outline-none focus:ring-2 focus:ring-[#45AAB8] font-body text-sm lg:text-base"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter Pills */}
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

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => product.slug && navigate(`/product/${product.slug}`)}
                className="bg-white rounded-xl overflow-hidden border border-[#E4E1E1] hover:shadow-md transition-shadow flex flex-col min-h-[450px] cursor-pointer"
              >
                {/* Product Image Placeholder */}
                <div className="bg-[#EDEDED] aspect-[16/10] flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 max-w-xs">
                      <p className="text-sm text-gray-600 mb-1 font-body">Product Image</p>
                      <p className="text-xs text-gray-400 font-body">{product.title} test kit</p>
                    </div>
                  </div>
                </div>

                {/* Product Info - Flex grow to push button to bottom */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-body text-xl font-bold text-[#000000] mb-2">
                    {product.title}
                  </h3>
                  <p className="font-body text-sm text-[#4B5563] mb-4 leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  {/* Price Button - Always at bottom */}
                  {product.available ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: product.slug || String(product.id),
                          name: product.title,
                          price: product.price,
                          image: '/placeholder.png'
                        });
                      }}
                      className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white font-body font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between mt-auto"
                    >
                      <span className="text-base">{product.price}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-full bg-gray-200 text-gray-600 font-body font-semibold py-3 px-4 rounded-lg text-center mt-auto">
                      {product.price}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-lg text-[#575151]">
                No test kits match your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
