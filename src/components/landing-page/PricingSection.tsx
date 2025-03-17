"use client"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    description: "Essential features for personal use",
    price: "₹0",
    period: "forever",
    features: [
      "Upload up to 10 Prescriptions",
      "3 Voice Assistant Calls/Day",
      "Basic Storage (1GB)",
      "Basic Patient Management",
      "Basic Reports",
      "Email Support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    description: "Complete solution for healthcare needs",
    price: "₹999",
    period: "per month",
    features: [
      "Unlimited Prescription Uploads",
      "Unlimited Voice Assistant",
      "25GB Document Storage",
      "Advanced Patient Management",
      "Detailed Analytics",
      "Priority Support",
      "Personalized Health Insights",
      "Custom Report Templates"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    description: "Tailored solutions for organizations",
    price: "Custom",
    period: "pricing",
    features: [
      "Everything in Professional",
      "Unlimited Document Storage",
      "API Access",
      "Custom Integrations",
      "Dedicated Account Manager",
      "24/7 Phone Support",
      "Advanced Security Features",
      "Multi-location Management"
    ],
    cta: "Contact Sales",
    popular: false
  }
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your practice&apos;s needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl overflow-hidden border ${
                plan.popular 
                  ? "border-blue-500 dark:border-blue-600" 
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className={`p-8 ${
                plan.popular 
                  ? "bg-blue-50 dark:bg-blue-900/20" 
                  : "bg-white dark:bg-gray-900"
              }`}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {plan.period}
                  </span>
                </div>
                <Link 
                  href={plan.name === "Enterprise" ? "/contact" : "/signup"} 
                  className={`block w-full py-3 px-4 rounded-lg text-center font-medium ${
                    plan.popular 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  } transition-colors duration-200`}
                >
                  {plan.cta}
                </Link>
              </div>
              <div className="p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.popular 
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" 
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <Link 
            href="/compare" 
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Compare all features →
          </Link>
        </div>
      </div>
    </section>
  )
}