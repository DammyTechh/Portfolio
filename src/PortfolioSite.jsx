import Cursor        from './components/Cursor'
import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
import Hero          from './sections/Hero'
import About         from './sections/About'
import Metrics       from './sections/Metrics'
import Projects      from './sections/Projects'
import Services      from './sections/Services'
import Stack         from './sections/Stack'
import Experience    from './sections/Experience'
import Certifications from './sections/Certifications'
import Testimonials  from './sections/Testimonials'
import Contact       from './sections/Contact'

export default function PortfolioSite() {
  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <div className="divider" />
        <About />
        <div className="divider" />
        <Metrics />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Services />
        <div className="divider" />
        <Stack />
        <div className="divider" />
        <Experience />
        <div className="divider" />
        <Certifications />
        <div className="divider" />
        <Testimonials />
        <div className="divider" />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
