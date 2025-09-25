import { Suspense } from 'react'
import { Hero } from '@/components/sections/Hero'
import { InventoryShowcase } from '@/components/sections/InventoryShowcase'
import { PreferenceChooser } from '@/components/sections/PreferenceChooser'
import { AboutUs } from '@/components/sections/AboutUs'
import { GallerySlider } from '@/components/sections/GallerySlider'
import { ContactFooter } from '@/components/sections/ContactFooter'
import { StatsSection } from '@/components/sections/StatsSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <main>
        <Hero />
        <StatsSection />
        
        <Suspense fallback={<LoadingSpinner />}>
          <InventoryShowcase />
        </Suspense>
        
        <PreferenceChooser />
        <FeaturesSection />
        <AboutUs />
        <TestimonialsSection />
        
        <Suspense fallback={<LoadingSpinner />}>
          <GallerySlider />
        </Suspense>
        
        <ContactFooter />
      </main>
      
      <Footer />
    </div>
  )
}
