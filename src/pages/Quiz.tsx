import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductDetailsModal from '../components/ProductDetailsModal';

interface QuizState {
  step: number;
  symptomCategory: string;
  step2Selections: string[];
  step3Selections: string[];
  recommendedTest: {
    name: string;
    image: string;
    description: string;
  } | null;
}

const Quiz = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    step: 1,
    symptomCategory: '',
    step2Selections: [],
    step3Selections: [],
    recommendedTest: null
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const symptomCategories = [
    { value: 'syphilis', label: 'Genital sore, Rash on Palms/Soles, Swollen nodes, Anal symptoms, Sore Throat after sex' },
    { value: 'gonorrhea', label: 'Discharge, Genital burning, Pelvic pain, Rectal symptoms, Sore throat after sex' },
    { value: 'hiv', label: 'Rash, Fever, Sore throat, Swollen nodes, Genital sore, Discharge, Weight loss' },
    { value: 'chlamydia', label: 'Discharge, Pelvic pain, Rectal/Throat symptoms' },
    { value: 'typhoid', label: 'Fever, Headache, Abdominal pain, Nausea/Vomiting, Bowel changes' },
    { value: 'uti', label: 'Burning with urination, urgency, cloudy urine' },
    { value: 'ulcer', label: 'Upper abdominal pain, Heartburn, Nausea.' },
    { value: 'hepatitis', label: 'Jaundice, Dark urine, Pale stools, Fatigue.' },
    { value: 'menopause', label: 'Hot flushes, Irregular periods' },
    { value: 'vaginal-ph', label: 'Itching, Odor, Discharge changes.' },
  ];

  const step2Questions = {
    'syphilis': [
      'Have you noticed a painless sore on your genitals, anus, mouth, or lips?',
      'Do you have a widespread rash or rash on your palms/soles?',
      'Have you had unprotected sex or new/multiple partners recently?',
      'Are you (or your partner) pregnant?'
    ],
    'gonorrhea': [
      'Do you have burning when urinating',
      'Do you have yellow/green vaginal or penile discharge?',
      'Have you had rectal pain or sore throat after sexual contact?',
      'Do you have pelvic pain or testicular pain?'
    ],
    'hiv': [
      'I have had unprotected sex or shared needles in the last 6–12 weeks?',
      'I had fever, rash, or swollen lymph nodes recently?',
      'I have a partner that have been diagnosed with HIV or another STI recently?',
      'My last HIV test was taken within 6 weeks of a possible exposure?'
    ],
    'chlamydia': [
      'Have you had an unusual discharge (clear/cloudy/yellow/white)?',
      'Do you have pelvic pain, bleeding between periods, or pain during sex?',
      'Any rectal, throat, or eye symptoms after sexual contact?',
      'Have you had new or multiple partners?'
    ],
    'typhoid': [
      'Have you had a fever for 3 or more days?',
      'Have you had abdominal pain, nausea, or poor appetite?',
      'Have you eaten unsafe/contaminated food or water recently?',
      'Have you traveled to, or live in, an area with poor sanitation?'
    ],
    'uti': [
      'Do you feel burning or pain while urinating?',
      'Is your urine cloudy, smelly, or bloody?',
      'Do you feel the need to urinate very often?',
      'Do you have mild lower abdominal discomfort?'
    ],
    'ulcer': [
      'Do you have burning stomach pain that gets better or worse after food?',
      'Do you have recurrent heartburn or indigestion?',
      'Do you feel full quickly when eating?',
      'Have your symptoms lasted for more than 2 weeks?'
    ],
    'hepatitis': [
      'Do you have yellowing of the eyes or skin?',
      'Do you have dark urine or pale stools?',
      'Have you had unprotected sex or blood exposure recently?',
      'Are you pregnant or living with someone with hepatitis B?'
    ],
    'menopause': [
      'Have you had irregular or missed periods recently',
      'Are you experiencing hot flushes or night sweats',
      'Do you have vaginal dryness or mood changes?',
      'Are you between ages 40–60?'
    ],
    'vaginal-ph': [
      'Do you have new itching or soreness in the vaginal area?',
      'Has your discharge changed (color, smell, thickness)?',
      'Have you used antibiotics or new soaps recently?',
      'Do you have pain during sex or external irritation?'
    ]
  };

  const step3Questions = [
    'Are your symptoms persistent (lasting more than a week)?',
    'Have the symptoms worsened over time?',
    'Have you experienced these symptoms before?',
    'Are you currently taking any medication?'
  ];

  const getRecommendedTest = () => {
    const testMap: Record<string, any> = {
      'syphilis': { name: 'Syphilis', image: '/test-kits/syphilis.png', description: 'A rapid test for detecting Syphilis antibodies.' },
      'gonorrhea': { name: 'Gonorrhea', image: '/test-kits/gonorrhea.png', description: 'An at-home test for detecting Gonorrhea infection.' },
      'hiv': { name: 'HIV', image: '/test-kits/hiv.png', description: 'A confidential at-home HIV test for detecting antibodies.' },
      'chlamydia': { name: 'Chlamydia', image: '/test-kits/chlamydia.png', description: 'A simple test for detecting Chlamydia infection.' },
      'typhoid': { name: 'Typhoid', image: '/test-kits/typhoid.png', description: 'An at-home rapid test for detecting Salmonella typhi antibodies.' },
      'uti': { name: 'Urinary Tract Infection', image: '/test-kits/uti.png', description: 'Test for detecting urinary tract infections.' },
      'ulcer': { name: 'Stomach Ulcer', image: '/test-kits/ulcer.png', description: 'An at-home test for detecting H. pylori and ulcer-related markers.' },
      'hepatitis': { name: 'Hepatitis B', image: '/test-kits/hepatitis.png', description: 'A test for detecting Hepatitis B surface antigens.' },
      'menopause': { name: 'Menopause', image: '/test-kits/menopause.png', description: 'Hormone level test to confirm menopausal status.' },
      'vaginal-ph': { name: 'Vaginal pH Infection', image: '/test-kits/vaginal-ph.png', description: 'Test for vaginal pH imbalance and potential infections.' }
    };
    return testMap[quizState.symptomCategory] || testMap['typhoid'];
  };

  const products: Record<string, any> = {
    'syphilis': { id: 12, slug: 'syphilis', title: 'Syphilis', price: '₦9,900', description: 'A rapid test for detecting Syphilis antibodies.', fullDescription: 'A comprehensive at-home test for detecting Syphilis antibodies in blood samples.' },
    'gonorrhea': { id: 11, slug: 'gonorrhea', title: 'Gonorrhea', price: '₦9,900', description: 'An at-home test for detecting Gonorrhea infection.', fullDescription: 'A confidential at-home test for detecting Gonorrhea infection.' },
    'hiv': { id: 6, slug: 'hiv', title: 'HIV', price: '₦8,000', description: 'A confidential at-home HIV test.', fullDescription: 'A confidential at-home test for detecting HIV antibodies in blood samples.' },
    'chlamydia': { id: 13, slug: 'chlamydia', title: 'Chlamydia', price: '₦9,900', description: 'A simple test for detecting Chlamydia infection.', fullDescription: 'A simple test for detecting Chlamydia infection.' },
    'typhoid': { id: 5, slug: 'typhoid', title: 'Typhoid', price: '₦21,000', description: 'A test for detecting Salmonella typhi antibodies.', fullDescription: 'An at-home rapid test for detecting Salmonella typhi antibodies in blood samples.' },
    'uti': { id: 7, slug: 'uti', title: 'Urinary Tract Infection', price: '₦25,000', description: 'Test for detecting urinary tract infections.', fullDescription: 'An at-home test to detect bacterial infections in the urinary tract.' },
    'ulcer': { id: 2, slug: 'stomach-ulcer', title: 'Stomach Ulcer', price: '₦23,000', description: 'Test for detecting H. pylori infection.', fullDescription: 'An at-home test to detect an active Helicobacter pylori (H. pylori) infection from a stool sample.' },
    'hepatitis': { id: 3, slug: 'hepatitis-b', title: 'Hepatitis B', price: '₦9,900', description: 'Test for detecting Hepatitis B.', fullDescription: 'An at-home rapid test that checks for Hepatitis B Surface Antigen (HBsAg) in a blood sample.' },
    'menopause': { id: 14, slug: 'menopause', title: 'Menopause', price: '₦12,000', description: 'Hormone level test to confirm menopausal status.', fullDescription: 'Hormone level test to confirm menopausal status.' },
    'vaginal-ph': { id: 10, slug: 'vaginal-ph', title: 'Vaginal pH Infection', price: '₦9,900', description: 'Test for vaginal pH imbalance.', fullDescription: 'Test for vaginal pH imbalance and potential infections at home.' }
  };

  const handleNext = () => {
    if (quizState.step === 1 && !quizState.symptomCategory) {
      alert('Please select a symptom category');
      return;
    }
    if (quizState.step === 2 && quizState.step2Selections.length === 0) {
      alert('Please select at least one option');
      return;
    }
    if (quizState.step === 3 && quizState.step3Selections.length === 0) {
      alert('Please select at least one option');
      return;
    }

    if (quizState.step === 3) {
      // Show results
      setQuizState({ ...quizState, step: 4, recommendedTest: getRecommendedTest() });
    } else {
      setQuizState({ ...quizState, step: quizState.step + 1 });
    }
  };

  const handlePrevious = () => {
    if (quizState.step > 1) {
      setQuizState({ ...quizState, step: quizState.step - 1 });
    }
  };

  const handleRetake = () => {
    setQuizState({
      step: 1,
      symptomCategory: '',
      step2Selections: [],
      step3Selections: [],
      recommendedTest: null
    });
  };

  const toggleStep2Selection = (question: string) => {
    if (quizState.step2Selections.includes(question)) {
      setQuizState({
        ...quizState,
        step2Selections: quizState.step2Selections.filter(q => q !== question)
      });
    } else {
      setQuizState({
        ...quizState,
        step2Selections: [...quizState.step2Selections, question]
      });
    }
  };

  const toggleStep3Selection = (question: string) => {
    if (quizState.step3Selections.includes(question)) {
      setQuizState({
        ...quizState,
        step3Selections: quizState.step3Selections.filter(q => q !== question)
      });
    } else {
      setQuizState({
        ...quizState,
        step3Selections: [...quizState.step3Selections, question]
      });
    }
  };

  const progressPercentage = (quizState.step / 3) * 100;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16 px-4 lg:py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          {quizState.step <= 3 && (
            <>
              {/* Page Header */}
              <div className="text-center mb-8">
                <h1 className="font-body text-3xl lg:text-4xl font-bold text-[#000000] mb-4">
                  Find the Right Test for You
                </h1>
                <p className="font-body text-base text-[#4B5563] max-w-xl mx-auto">
                  Answer a few simple questions, and we'll recommend the best test for your symptoms.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="w-full bg-[#E5E7EB] rounded-full h-2 mb-2">
                  <div 
                    className="bg-[#45AAB8] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="font-body text-sm text-[#4B5563]">Step {quizState.step} of 3</span>
                </div>
              </div>

              {/* Quiz Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 min-h-[500px] flex flex-col">
                {/* Content Area */}
                <div className="flex-1">
                  {/* Step 1: Symptom Category */}
                  {quizState.step === 1 && (
                    <div>
                      <h2 className="font-body text-2xl font-bold text-[#000000] text-center mb-8">
                        What symptoms are you experiencing?
                      </h2>
                      <select
                        value={quizState.symptomCategory}
                        onChange={(e) => setQuizState({ ...quizState, symptomCategory: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-body text-base text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#45AAB8] focus:border-transparent mb-8"
                      >
                        <option value="">Select an option</option>
                        {symptomCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Step 2: Specific Symptoms */}
                  {quizState.step === 2 && (
                    <div>
                      <h2 className="font-body text-2xl font-bold text-[#000000] text-center mb-8">
                        Select One if true
                      </h2>
                      <div className="space-y-4 mb-8">
                        {(step2Questions[quizState.symptomCategory as keyof typeof step2Questions] || []).map((question, index) => (
                          <label key={index} className="flex items-start gap-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={quizState.step2Selections.includes(question)}
                              onChange={() => toggleStep2Selection(question)}
                              className="mt-1 w-5 h-5 text-[#45AAB8] border-gray-300 rounded focus:ring-[#45AAB8]"
                            />
                            <span className="font-body text-base text-[#4B5563]">{question}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Additional Details */}
                  {quizState.step === 3 && (
                    <div>
                      <h2 className="font-body text-2xl font-bold text-[#000000] text-center mb-8">
                        Additional Information
                      </h2>
                      <div className="space-y-4 mb-8">
                        {step3Questions.map((question, index) => (
                          <label key={index} className="flex items-start gap-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={quizState.step3Selections.includes(question)}
                              onChange={() => toggleStep3Selection(question)}
                              className="mt-1 w-5 h-5 text-[#45AAB8] border-gray-300 rounded focus:ring-[#45AAB8]"
                            />
                            <span className="font-body text-base text-[#4B5563]">{question}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons - Always at Bottom */}
                <div className="flex gap-4 mt-auto pt-4">
                  <button
                    onClick={handlePrevious}
                    disabled={quizState.step === 1}
                    className={`flex-1 py-3 px-6 rounded-xl font-body font-semibold transition-colors ${
                      quizState.step === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-2 border-[#45AAB8] text-[#45AAB8] hover:bg-[#45AAB8] hover:text-white'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-[#45AAB8] hover:bg-[#3d98a5] text-white py-3 px-6 rounded-xl font-body font-semibold transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Results Page */}
          {quizState.step === 4 && quizState.recommendedTest && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <h2 className="font-body text-3xl font-bold text-[#000000] text-center mb-4">
                Find the Right Test for You
              </h2>
              <p className="font-body text-base text-[#4B5563] text-center mb-8">
                Based on your responses, this test is most suitable for your needs.
              </p>

              {/* Product Image Placeholder */}
              <div className="bg-[#EDEDED] aspect-[16/10] rounded-xl flex items-center justify-center mb-6">
                <div className="text-center px-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-xs">
                    <p className="text-lg font-bold text-gray-700 mb-2 font-body">{quizState.recommendedTest.name}</p>
                    <p className="text-sm text-gray-500 font-body">Test Kit Image</p>
                  </div>
                </div>
              </div>

              <h3 className="font-body text-2xl font-bold text-[#000000] mb-3">
                {quizState.recommendedTest.name}
              </h3>
              <p className="font-body text-base text-[#4B5563] mb-8">
                {quizState.recommendedTest.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setSelectedProduct(products[quizState.symptomCategory]);
                    setShowModal(true);
                  }}
                  className="w-full bg-[#45AAB8] hover:bg-[#3d98a5] text-white py-3 px-6 rounded-xl font-body font-semibold transition-colors"
                >
                  View Test Details
                </button>
                <button
                  onClick={handleRetake}
                  className="w-full bg-white border-2 border-gray-300 text-[#4B5563] hover:border-[#45AAB8] hover:text-[#45AAB8] py-3 px-6 rounded-xl font-body font-semibold transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Product Details Modal */}
      <ProductDetailsModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Quiz;
