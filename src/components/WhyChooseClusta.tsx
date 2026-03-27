const WhyChooseClusta = () => {
  const values = [
    {
      title: "Fast and Easy",
      description: "Get reliable results in minutes. Simple instructions for accurate results every time.",
      icon: "clock"
    },
    {
      title: "Lab-Grade Accuracy",
      description: "Revolutionary technology in a portable format, with clinically proven accuracy.",
      icon: "check"
    },
    {
      title: "Discreet test and delivery",
      description: "Results are strictly private and confidential. Delivery boxes are discreet.",
      icon: "delivery"
    },
    {
      title: "Regulatory approved",
      description: "Our products are CE marked and registered with the MHRA.",
      icon: "shield"
    }
  ];

  const stats = [
    {
      value: "100+",
      label: "Test Completed"
    },
    {
      value: "98%",
      label: "Customer Satisfaction"
    },
    {
      value: "3min",
      label: "Average Result time"
    }
  ];

  return (
    <section className="py-16 px-4 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1344px]">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#101828] mb-4">
            Why Choose Clusta?
          </h2>
          <p className="font-body text-base lg:text-lg text-[#575151] max-w-3xl mx-auto">
            Affordable, accurate, and easy-to-use test kits designed for Nigeria and Africa, putting healthcare in your hands.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-white border border-[#E4E1E1] rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              {/* Icon Circle */}
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#F0F9F9] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#45AAB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {value.icon === 'clock' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                  {value.icon === 'check' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                  {value.icon === 'delivery' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  )}
                  {value.icon === 'shield' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  )}
                </svg>
              </div>

              {/* Content */}
              <h3 className="font-body text-lg font-bold text-[#101828] mb-3">
                {value.title}
              </h3>
              <p className="font-body text-sm text-[#575151] leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="font-heading text-4xl lg:text-5xl font-bold text-[#101828] mb-2">
                {stat.value}
              </div>
              <div className="font-body text-sm lg:text-base text-[#575151]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseClusta;
