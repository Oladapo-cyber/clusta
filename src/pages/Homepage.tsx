
import Header from '../components/Header'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import WhyChooseClusta from '../components/WhyChooseClusta'
import PopularTestKits from '../components/PopularTestKits'
import QuizCTA from '../components/QuizCTA'
import Footer from '../components/Footer'

function Homepage() {

    return (
      
    <div>
        <Header />
        <main>
            <Hero />
            <HowItWorks />
            <WhyChooseClusta />
            <PopularTestKits />
            <QuizCTA />
        </main>
        <Footer />
    </div>
  )
}

export default Homepage