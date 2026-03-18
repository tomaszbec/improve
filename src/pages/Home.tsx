import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Services } from '../components/Services'
import { About } from '../components/About'
import { Technologies } from '../components/Technologies'
import { Portfolio } from '../components/Portfolio'
import { Testimonials } from '../components/Testimonials'
import { Contact } from '../components/Contact'

export function Home() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Handle HTML5 routing scroll
    const sectionId = pathname.substring(1)
    if (sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [pathname])

  return (
    <main>
      <Hero />
      <div id="services"><Services /></div>
      <div id="about"><About /></div>
      <div id="technologies"><Technologies /></div>
      <div id="portfolio"><Portfolio /></div>
      <Testimonials />
      <div id="contact"><Contact /></div>
    </main>
  )
}
