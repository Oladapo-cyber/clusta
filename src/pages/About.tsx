import Header from '../components/Header';
import Footer from '../components/Footer';
import about1 from '../assets/about1.png';
import about2 from '../assets/about2.png';
import about3 from '../assets/about3.png';

const aboutSections = [
  {
    title: 'About Us',
    image: about1,
    imageAlt: 'Scientists working in a diagnostics laboratory',
    reverse: false,
    dark: false,
    paragraphs: [
      'Founded in Nigeria with a vision to transform healthcare across Africa, Clusta is a pioneering biotechnology company dedicated to making diagnostic testing accessible to every household.',
      "We understand the unique healthcare challenges facing African communities - from limited access to diagnostic facilities to the need for affordable, reliable testing solutions. That's why we've developed a comprehensive range of rapid test kits that deliver lab-grade accuracy in minutes.",
      'Our mission is simple: to democratize healthcare by putting powerful diagnostic tools directly into the hands of individuals, families, and healthcare providers across Nigeria and beyond.',
    ],
  },
  {
    title: 'Our Team',
    image: about2,
    imageAlt: 'The Clusta team in a laboratory',
    reverse: true,
    dark: true,
    paragraphs: [
      'Our diverse team of Nigerian and African scientists, medical professionals, and engineers brings together decades of experience in biotechnology, diagnostics, and healthcare innovation.',
      'Led by renowned experts in molecular diagnostics and public health, our team combines international research experience with deep understanding of African healthcare needs. We work tirelessly to ensure our products meet the highest global standards while being culturally relevant and accessible to our communities.',
      'From our state-of-the-art research facilities in Lagos to our field teams across Nigeria, every member of the Clusta family is committed to advancing healthcare equity in Africa.',
    ],
  },
  {
    title: 'Our Community',
    image: about3,
    imageAlt: 'Healthcare professionals collaborating in a laboratory',
    reverse: false,
    dark: false,
    paragraphs: [
      'At Clusta, we believe healthcare is a community effort. We work closely with local healthcare providers, community health workers, and traditional healers to ensure our testing solutions complement and enhance existing healthcare systems.',
      "Through partnerships with NGOs, government health programs, and international organizations, we're making quality diagnostic testing available in remote villages, urban centers, and everywhere in between. Our community outreach programs provide education, training, and support to ensure everyone can benefit from our innovations.",
      'Together, we are building a healthier Africa - one test, one person, one community at a time. Join us in this mission to make quality healthcare accessible to all Africans.',
    ],
  },
];

const About = () => {
  return (
    <div className="font-body">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#45AAB8] px-4 py-14 text-center text-[#101828] md:py-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.1]">
            Science That Puts You in Control
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-normal text-[#3C484F] md:text-xl">
            Proudly Nigerian, empowering Africa with accessible, accurate health testing for everyone.
          </p>
        </div>
      </section>

      {aboutSections.map((section) => (
        <section
          key={section.title}
          className={`px-4 py-14 md:py-16 ${section.dark ? 'bg-[#A5A6A8]' : 'bg-white'}`}
        >
          <div className="container mx-auto max-w-[1344px] px-3 md:px-6 lg:px-12">
            <div
              className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                section.reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
              }`}
            >
              <div>
                <h2 className={`font-heading text-4xl font-semibold ${section.dark ? 'text-white' : 'text-[#1F2937]'}`}>
                  {section.title}
                </h2>
                <div
                  className={`mt-6 space-y-5 text-[20px] leading-[1.6] ${
                    section.dark ? 'text-[#F8FAFC]' : 'text-[#4B5563]'
                  }`}
                >
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.15)]">
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className="h-full min-h-[220px] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Our Promise Banner */}
      <section className="bg-[#45AAB8] px-4 py-16 text-center text-white md:py-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Our Promise to Africa
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#EAF7FA] md:text-xl">
            Each Clusta test is backed by rigorous science, validated accuracy, and a commitment to privacy.
            We are not just providing tests - we are empowering African communities to take control of their
            health and build a stronger, healthier future for generations to come.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
