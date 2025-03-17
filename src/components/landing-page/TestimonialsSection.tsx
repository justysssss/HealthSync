"use client"
import Image from "next/image"
import { useState } from "react"

const testimonials = [
  {
    id: 1,
    content: "HealthSync has completely transformed how we manage patient care. The medication tracking system has reduced errors by 87%, and our patients love the mobile app for appointment scheduling.",
    author: "Dr. Sarah Johnson",
    role: "Medical Director, Johnson Family Practice",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    content: "As a busy clinic with over 2,000 patients, we needed a solution that could scale with us. HealthSync's intuitive interface and comprehensive feature set has made our transition to digital health records seamless.",
    author: "Dr. Michael Chen",
    role: "Chief Medical Officer, Westside Medical Group",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    content: "The telemedicine integration has been a game-changer for our rural patients. We've increased appointment adherence by 42% and reduced no-shows significantly. The ROI has been remarkable.",
    author: "Dr. Emily Rodriguez",
    role: "Founder, Countryside Health Partners",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop"
  }
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-24 bg-blue-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See what medical professionals are saying about HealthSync
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-lg z-0"></div>
            <div className="absolute bottom-0 right-0 transform translate-x-4 translate-y-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-lg z-0"></div>
            
            <div className="relative z-10">
              <svg className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
                {testimonials[activeIndex].content}
              </p>
              
              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4 rounded-full overflow-hidden">
                  <Image 
                    src={testimonials[activeIndex].avatar} 
                    alt={testimonials[activeIndex].author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonials[activeIndex].author}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeIndex 
                      ? "bg-blue-600 dark:bg-blue-500" 
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}