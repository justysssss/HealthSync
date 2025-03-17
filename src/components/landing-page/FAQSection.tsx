"use client"
import { useState } from "react"

const faqs = [
  {
    question: "Is HealthSync HIPAA compliant?",
    answer: "Yes, HealthSync is fully HIPAA compliant. We implement industry-standard security measures including end-to-end encryption, role-based access controls, and regular security audits to ensure your patient data remains protected at all times."
  },
  {
    question: "Can I migrate data from my current system?",
    answer: "Absolutely. Our team provides comprehensive data migration services to help you transition smoothly from your current system to HealthSync. We support imports from most major EHR and practice management systems, ensuring your historical patient data is preserved."
  },
  {
    question: "How long does implementation take?",
    answer: "Implementation typically takes 2-4 weeks depending on the size of your practice and complexity of your needs. Our dedicated implementation team will guide you through every step of the process, from initial setup to staff training."
  },
  {
    question: "Do you offer training for my staff?",
    answer: "Yes, we provide comprehensive training for all staff members. This includes live virtual training sessions, on-demand video tutorials, and detailed documentation. Our support team is also available to answer any questions during the learning process."
  },
  {
    question: "Can patients access their records?",
    answer: "Yes, HealthSync includes a secure patient portal where patients can access their medical records, view test results, request prescription refills, schedule appointments, and communicate with their healthcare providers."
  },
  {
    question: "Does HealthSync integrate with other systems?",
    answer: "HealthSync offers integrations with a wide range of healthcare systems including lab systems, billing platforms, pharmacies, and insurance providers. We also provide API access for custom integrations with Enterprise plans."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Find answers to common questions about HealthSync
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="p-6 pt-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Still have questions? We&apos;re here to help.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Support
              </a>
              <a 
                href="/documentation" 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}