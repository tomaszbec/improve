import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AntigravityBackground } from './components/AntigravityBackground'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { SecurityAudit } from './pages/SecurityAudit'
import { ServicePage } from './pages/ServicePage'
import { ProjectPage } from './pages/ProjectPage'
import { NotFound } from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      {/* Visual Enhancements */}
      <div className="atmosphere" aria-hidden="true">
        <div className="aurora aurora--1" />
        <div className="aurora aurora--2" />
        <div className="aurora aurora--3" />
      </div>
      <AntigravityBackground />
      <div className="grain-overlay" aria-hidden="true" />
      
      <div className="layout-wrapper">
        <Navbar />
        <main className="layout-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Home />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/about" element={<Home />} />
            <Route path="/technologies" element={<Home />} />
            <Route path="/portfolio" element={<Home />} />
            <Route path="/portfolio/:slug" element={<ProjectPage />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/audyt-bezpieczenstwa" element={<SecurityAudit />} />
            <Route path="/security-audit" element={<SecurityAudit />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
