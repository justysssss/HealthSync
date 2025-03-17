"use client"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-sky-500 dark:from-blue-900 dark:to-sky-800">
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute right-0 top-0 h-full w-1/2 transform translate-x-1/3 text-blue-500/20 dark:text-blue-300/10" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <svg className="absolute left-0 bottom-0 h-full w-1/2 transform -translate-x-1/3 text-blue-500/20 dark:text-blue-300/10" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to transform your healthcare practice?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of healthcare providers who are streamlining their workflows, improving patient care, and growing their practices with HealthSync.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial
            </Link>
            <Link 
              href="/book-demo" 
              className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition-colors"
            >
              Schedule a Demo
            </Link>
          </div>
          
          <p className="mt-6 text-blue-100 text-sm">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  )
}