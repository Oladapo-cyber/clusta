import { useNavigate } from 'react-router-dom';

const QuizCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-[#45AAB8]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1344px] text-center">
        <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-6">
          Not sure which test to choose?
        </h2>
        <p className="font-body text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Take our free quiz and get personalized recommendations
        </p>
        <button 
          onClick={() => navigate('/quiz')}
          className="bg-white text-[#45AAB8] font-body font-semibold px-8 py-3 rounded-full inline-flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          Take the Quiz
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default QuizCTA;
