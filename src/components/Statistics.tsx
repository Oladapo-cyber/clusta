const Statistics = () => {
  const stats = [
    { value: "100+", label: "Test Completed" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "3min", label: "Average Result time" }
  ];

  return (
    <section className="py-12 bg-[#F9FAFB]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1344px]">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="font-display text-[40px] font-bold text-[#101828] mb-2">
                {stat.value}
              </div>
              <div className="font-body text-[16px] text-[#575151]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
