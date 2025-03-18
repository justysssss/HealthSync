"use client"
import Image from 'next/image'
import Link from 'next/link'
import { HeartPulse } from "lucide-react"
import { useState } from 'react'
 
const Navbar = () => {
const [openNavbar, setOpenNavbar] = useState(false)
const toggleNavbar = () => {
    setOpenNavbar(openNavbar => !openNavbar)
}
const closeNavbar = () => {
    setOpenNavbar(false)
}
return (
    <>
        <div onClick={() => { closeNavbar() }} aria-hidden="true" className={
            `fixed bg-gray-800/40 inset-0 z-30 ${openNavbar ? "flex lg:hidden" : "hidden"}`
        } />
        <header className="absolute inset-x-0 top-0 flex items-center h-20 z-40 pt-4 px-4">
            <nav className="relative mx-auto lg:max-w-7xl w-full border border-gray-100 dark:border-gray-900 bg-white/70 dark:bg-gray-950/80 rounded-xl h-full px-4 flex gap-x-5 justify-between items-center backdrop-blur-sm">
                <div className="flex items-center min-w-max">
                    <Link href="/" className="text-xl font-semibold text-gray-800 dark:text-gray-200 inline-flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <HeartPulse className="h-6 w-6" />
                      </div>
                      <span className="relative after:absolute after:inset-0 after:rotate-3 after:border after:border-blue-700 dark:after:border-blue-600 text-blue-700 dark:text-blue-600">Health</span>Sync
                    </Link>
                </div>
                <div className={`
                    fixed inset-y-0 w-10/12 max-w-md lg:max-w-none bg-white dark:bg-gray-950 lg:!bg-transparent border-b border-gray-200 dark:border-gray-800 py-8 lg:py-0 px-5 sm:px-10 md:px-12 lg:px-0 lg:border-none lg:w-full lg:top-0 lg:relative lg:flex lg:justify-between duration-300 ease-linear gap-x-6
                    ${openNavbar ? "left-0" : "-left-full lg:left-0"}
                `}>
                    <ul className="flex flex-col lg:flex-row gap-6 lg:items-center text-gray-700 dark:text-gray-300 lg:flex-1 lg:justify-center">
                        <li>
                            <Link href="#features" className="duration-300 ease-linear hover:text-blue-600 flex items-center gap-1.5 justify-between">
                                Features
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#video" className="duration-300 ease-linear hover:text-blue-600">
                                Watch Demo
                            </Link>
                        </li>
                        <li>
                            <Link href="#pricing" className="duration-300 ease-linear hover:text-blue-600 flex items-center gap-1.5 justify-between">
                                Pricing
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#testimonials" className="duration-300 ease-linear hover:text-blue-600">Testimonials</Link>
                        </li>
                        <li>
                            <Link href="/support" className="duration-300 ease-linear hover:text-blue-600">Support</Link>
                        </li>
                    </ul>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:min-w-max mt-10 lg:mt-0">
                        <Link href="/sign-up" className="px-6 h-10 text-sm flex items-center w-full lg:w-max justify-center gap-x-3 border border-gray-200 dark:border-gray-800 rounded-lg text-blue-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300">
                            Sign Up
                        </Link>
                    </div>
                </div>
                <div className="flex items-center lg:hidden">
                    <button onClick={() => { toggleNavbar() }} aria-label="Toggle navbar" className="outline-none border-l border-l-blue-100 dark:border-l-gray-800 pl-3 relative py-3 children:flex">
                        <span aria-hidden="true" className={`
                                    h-0.5 w-6 rounded bg-gray-800 dark:bg-gray-300 transition duration-300
                                    ${openNavbar ? "rotate-45 translate-y-[0.33rem]" : ""}
                                `} />
                        <span aria-hidden="true" className={`
                                    mt-2 h-0.5 w-6 rounded bg-gray-800 dark:bg-gray-300 transition duration-300
                                    ${openNavbar ? "-rotate-45 -translate-y-[0.33rem]" : ""}
                                `} />
                    </button>
                </div>
            </nav>
        </header>
    </>
)
}
 
const metrics = [
{
    id: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
    stat: "HIPAA",
    title: "Compliant"
},
{
    id: 2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    stat: "Fast",
    title: "Implementation"
},
{
    id: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    stat: "Intuitive",
    title: "User Experience"
},
]

// Animated background gradient effect
const AnimatedGradient = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute -inset-[10px] opacity-50">
        <div className="absolute top-0 left-1/4 w-full aspect-square bg-gradient-to-r from-blue-500 to-sky-500 rounded-full mix-blend-multiply blur-[80px] animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-full aspect-square bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mix-blend-multiply blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-full aspect-square bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full mix-blend-multiply blur-[80px] animate-blob animation-delay-4000"></div>
      </div>
    </div>
  )
}
 
export default function HeroSection() {
return (
    <>
        <Navbar />
        <main>
            <section className="relative bg-blue-50/50 dark:bg-gray-900/30 pt-32 lg:pt-24 pb-32 lg:pb-4 overflow-hidden">
                <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 relative">
                    <AnimatedGradient />
                    <div className="flex text-center lg:text-left flex-col lg:items-center lg:flex-row gap-8 lg:gap-10 xl:gap-12 relative max-w-4xl lg:max-w-none">
                        <div className="space-y-8 xl:space-y-10 lg:py-12 flex-1 lg:w-1/2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                                <div className="relative px-4 py-2 bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 rounded-lg leading-none flex items-center justify-center space-x-2 mb-4 w-max mx-auto lg:mx-0">
                                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">New in 2025</span>
                                    <span className="text-gray-500 dark:text-gray-400">|</span>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">AI-Powered Diagnostics</span>
                                </div>
                            </div>
                            <h1 className="text-blue-950 dark:text-white text-3xl/tight sm:text-4xl/tight md:text-5xl/tight xl:text-6xl/tight font-bold">
                                The complete <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-700 to-sky-600 animate-text-gradient-background">healthcare</span> platform for your clinic
                            </h1>
                            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto lg:max-w-none text-lg">
                                Streamline patient care, manage medications, and enhance clinical workflows with our comprehensive healthcare management solution.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 z-30 sm:w-max sm:flex-nowrap mx-auto lg:mx-0">
                                <Link href="/signup" className="group relative px-5 h-12 flex items-center sm:w-max w-full justify-center bg-gradient-to-br from-blue-700 to-sky-600 text-white rounded-lg ease-linear transition hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden">
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg opacity-0 group-hover:opacity-100 group-active:opacity-90 transition duration-300"></span>
                                    <span className="relative">Get Started</span>
                                </Link>
                                {/* <Link href="#video" className="px-5 h-12 flex items-center sm:w-max w-full justify-center gap-x-3 border border-gray-200 dark:border-gray-900/60 rounded-lg text-blue-800 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Watch Demo
                                </Link> */}
                            </div>
                            <div className="max-w-lg lg:max-w-none mx-auto grid sm:grid-cols-3 divide-y divide-gray-100 dark:divide-gray-900 sm:divide-y-0 sm:gap-2 p-4 py-0 sm:py-4 text-left rounded-lg bg-white/80 dark:bg-gray-950/80 border border-gray-100 dark:border-gray-900 shadow-sm shadow-gray-200/50 dark:shadow-transparent backdrop-blur-sm">
                                {
                                    metrics.map(metric => (
                                        <div key={metric.id} className="flex items-center gap-x-4 py-4 sm:py-0">
                                            <span className="w-10 h-10 text-white bg-gradient-to-br from-blue-700 to-sky-400 rounded-md flex items-center justify-center">
                                                {metric.icon}
                                            </span>
                                            <div className="flex-1 flex flex-col text-sm">
                                                <h4 className="text-gray-700 dark:text-gray-300 font-semibold">{metric.stat}</h4>
                                                <span className="text-xs text-gray-400">{metric.title}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div aria-hidden="true" className="flex-1 lg:w-1/2 relative hidden lg:flex justify-end pr-8">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-sky-100 dark:bg-gradient-to-tr dark:from-gray-950 dark:to-gray-700 rounded-2xl transform rotate-1 -z-10"></div>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <Image 
                                    src="/doc-smiling.png" 
                                    width={3200} 
                                    height={1900} 
                                    className="w-11/12 h-auto relative rounded-lg  transition-transform duration-300 group-hover:scale-[1.01]" 
                                    alt="Medical professional using HealthSync application" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
)
}