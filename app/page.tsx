import Link from "next/link";
import MyResumes from "@/components/MyResumes";
import FeatureGrid from "@/components/FeatureGrid";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-red-50">
            {/* Navigation Bar */}
            <nav className="backdrop-blur-md bg-white/80 border-b border-red-100/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-sm">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-900 leading-tight">
                                Arvix Resume Builder
                            </span>
                            <span className="text-xs text-red-600 font-medium">
                                ATS Friendly
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/create"
                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 hover:shadow-md transition-all duration-200 font-medium text-sm"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Create Resume
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <header className="text-center mb-20 animate-fade-in pt-8">
                    <div className="inline-block mb-6">
                        <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                            ATS Friendly Resume Builder
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                        Build Your
                        <span className="text-red-600"> Dream Career</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                        Create professional, ATS-optimized resumes in minutes.
                        Stand out from the crowd and land your dream job with
                        resumes that pass automated screening systems.
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-red-100">
                            <svg
                                className="w-4 h-4 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                                ATS-Optimized
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-red-100">
                            <svg
                                className="w-4 h-4 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                                Easy to Use
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-red-100">
                            <svg
                                className="w-4 h-4 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                                Free Forever
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 text-base font-semibold group"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Create Your Resume Now
                        <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </Link>
                </header>

                <FeatureGrid />

                <MyResumes />

                {/* Footer Info */}
                <footer className="mt-20 text-center">
                    <div className="inline-block bg-white rounded-xl shadow-sm px-8 py-6 border border-gray-200">
                        <p className="text-gray-600 mb-3 font-light">
                            💼 Trusted by job seekers worldwide
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                ATS Compatible
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Easy Export
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Professional Templates
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
