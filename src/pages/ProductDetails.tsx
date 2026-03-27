import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
}

const products: Product[] = [
  {
    id: 'diabetes',
    title: 'Diabetes',
    price: '₦17,000',
    description: 'An at-home test that measures your average blood sugar levels over the past 2-3 months. Perfect for monitoring diabetes or checking if you\'re at risk. Simple finger-prick blood test with clear, confidential results.',
    image: '/test-kits/diabetes.png'
  },
  {
    id: 'stomach-ulcer',
    title: 'Stomach Ulcer',
    price: '₦23,000',
    description: 'Detects H. pylori bacteria, the primary cause of stomach ulcers and gastritis. Quick stool test that provides accurate results. Essential for anyone experiencing persistent stomach pain or digestive issues.',
    image: '/test-kits/ulcer.png'
  },
  {
    id: 'hepatitis-b',
    title: 'Hepatitis B',
    price: '₦9,900',
    description: 'A rapid blood test to detect Hepatitis B surface antigens. Early detection is crucial for effective treatment and preventing liver damage. Confidential at-home testing with clear instructions and fast results.',
    image: '/test-kits/hepatitis.png'
  },
  {
    id: 'cardiac-health',
    title: 'Cardiac health',
    price: '₦25,000',
    description: 'A comprehensive cardiac marker test that detects troponin levels to assess heart health and risk of heart attack. Essential for those with chest pain, family history of heart disease, or cardiovascular risk factors.',
    image: '/test-kits/cardiac.png'
  },
  {
    id: 'typhoid',
    title: 'Typhoid',
    price: '₦21,000',
    description: 'Rapid test for detecting Salmonella typhi antibodies associated with typhoid fever. Important for anyone experiencing prolonged fever, headaches, or abdominal discomfort, especially after consuming potentially contaminated food or water.',
    image: '/test-kits/typhoid.png'
  },
  {
    id: 'hiv',
    title: 'HIV',
    price: '₦8,000',
    description: 'A confidential at-home HIV test for detecting antibodies. Early detection enables timely treatment and better health outcomes. Simple finger-prick blood test with clear, private results and support resources.',
    image: '/test-kits/hiv.png'
  },
  {
    id: 'uti',
    title: 'Urinary Tract Infection',
    price: '₦25,000',
    description: 'Detects bacterial infections in the urinary tract. Quick urine test that identifies common UTI-causing bacteria. Perfect for those experiencing burning during urination, frequent urges, or cloudy urine.',
    image: '/test-kits/uti.png'
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy',
    price: '₦9,570',
    description: 'A reliable at-home pregnancy test for early detection of hCG hormone in urine. Provides accurate results as early as the first day of a missed period. Simple to use with clear, easy-to-read results.',
    image: '/test-kits/pregnancy.png'
  },
  {
    id: 'ovulation',
    title: 'Ovulation',
    price: '₦9,900',
    description: 'Tracks luteinizing hormone (LH) surges to identify your most fertile days. Ideal for those trying to conceive or understanding their cycle. Simple urine test with precise timing indicators.',
    image: '/test-kits/ovulation.png'
  },
  {
    id: 'vaginal-ph',
    title: 'Vaginal pH Infection',
    price: '₦9,900',
    description: 'Tests for vaginal pH imbalance and potential infections like bacterial vaginosis or yeast infections. Essential for women experiencing itching, unusual discharge, or odor. Quick, discreet at-home testing.',
    image: '/test-kits/vaginal-ph.png'
  },
  {
    id: 'gonorrhea',
    title: 'Gonorrhea',
    price: '₦9,900',
    description: 'Take control of your sexual health with our private and simple At-Home Gonorrhea Test Kit. This discreet test checks for the bacteria Neisseria gonorrhoeae using an easy-to-collect urine sample. Get confidential, accurate results quickly and take the first step toward peace of mind and proper care.',
    image: '/test-kits/gonorrhea.png'
  },
  {
    id: 'syphilis',
    title: 'Syphilis',
    price: '₦9,900',
    description: 'A rapid test for detecting Syphilis antibodies. Early detection is crucial for effective treatment. Confidential at-home blood test with clear instructions and fast, accurate results.',
    image: '/test-kits/syphilis.png'
  },
  {
    id: 'chlamydia',
    title: 'Chlamydia',
    price: '₦9,900',
    description: 'A simple test for detecting Chlamydia infection, one of the most common STIs. Easy urine sample collection with confidential results. Early detection prevents complications and transmission.',
    image: '/test-kits/chlamydia.png'
  }
];

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);

  if (!product) {
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

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image
      });
      // Optional: Add simple visual feedback here or rely on header badge
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
            <div className="bg-[#EDEDED] rounded-xl aspect-square flex items-center justify-center">
              <div className="text-center px-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 max-w-sm">
                  <p className="text-2xl font-bold text-gray-700 mb-3 font-body">{product.title}</p>
                  <p className="text-base text-gray-500 font-body">Test Kit Image</p>
                </div>
              </div>
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
                {product.description}
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
