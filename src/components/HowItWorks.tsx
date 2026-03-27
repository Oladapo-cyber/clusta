import firstRow1 from '../assets/firstrow1.png';
import firstRow2 from '../assets/firstrow2.png';
import firstRow3 from '../assets/firstrow3.png';

const HowItWorks = () => {
  const steps = [
    {
      title: "Find your test",
      description: "Choose from our range of user-friendly self-tests or take our free quiz to be expertly matched with the right tests for you.",
      image: firstRow1,
      alt: 'Find your test',
    },
    {
      title: "Take your test",
      description: "Receive your test and follow the step-by-step instructions for accurate, reliable results in minutes, all without having to leave your home.",
      image: firstRow2,
      alt: 'Take your test',
    },
    {
      title: "Track your health",
      description: "Record your test result and follow the guided aftercare advice. Access immediate support from healthcare professionals when you need it.",
      image: firstRow3,
      alt: 'Track your health',
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1344px]">
        {/* Section Heading */}
        <h2 className="font-heading text-[34px] leading-[34px] text-[#3C484F] text-center mb-16">
          How it works
        </h2>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col">
              <div className="bg-gray-100 rounded-product aspect-[4/3] mb-6 overflow-hidden">
                <img
                  src={step.image}
                  alt={step.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Content */}
              <h3 className="font-body text-lg font-bold text-[#101828] mb-3">
                {step.title}
              </h3>
              <p className="font-body text-lg leading-[27px] text-[#575151]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
