import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-heading font-semibold text-lg text-[#101828]">{question}</span>
        <span className={`text-[#45AAB8] transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 text-[#4B5563] leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      category: 'General',
      items: [
        {
          question: 'How accurate are the tests?',
          answer: 'All Clusta diagnostic tests are rigorously tested and validated to meet international standards. Our rapid test kits offer lab-grade accuracy, typically ranging from 98% to 99% when used correctly according to the instructions.'
        },
        {
          question: 'Is my data private?',
          answer: 'Absolutely. We take data privacy very seriously. Any information you submit through our platform is encrypted and anonymized. We comply with all relevant data protection regulations to ensure your health information remains confidential.'
        },
        {
          question: 'Do I need a doctor to interpret results?',
          answer: 'Our tests are designed for easy at-home use with clear, simple-to-read results. However, if you receive a positive result or are unsure about your symptoms, we strongly recommend consulting with a healthcare professional for further advice and confirmation.'
        }
      ]
    },
    {
      category: 'Shipping & Orders',
      items: [
        {
          question: 'How long does delivery take?',
          answer: 'For orders within Lagos, we offer same-day or next-day delivery. For other major cities in Nigeria, delivery typically takes 2-4 business days. Remote locations may take slightly longer.'
        },
        {
          question: 'Do you ship outside Nigeria?',
          answer: 'Currently, we are focused on serving the Nigerian market. We plan to expand to other African countries in the near future. Stay tuned for updates!'
        },
        {
          question: 'What is your return policy?',
          answer: 'Due to the nature of medical diagnostic products, we cannot accept returns capable of result tampering. However, if you receive a damaged or defective kit, please contact our support team immediately for a replacement.'
        }
      ]
    }
  ];

  return (
    <div className="font-body min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-[#101828] mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              Everything you need to know about Clusta tests, shipping, and more. 
              Can't find the answer you're looking for? <a href="/contact" className="text-[#45AAB8] font-semibold hover:underline">Contact us</a>.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-12">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-2xl font-bold text-[#101828] mb-6 pl-2 border-l-4 border-[#45AAB8]">
                  {section.category}
                </h2>
                <div className="space-y-0">
                  {section.items.map((item, index) => (
                    <FAQItem 
                      key={index} 
                      question={item.question} 
                      answer={item.answer} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
