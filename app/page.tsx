import { Resume } from "@/types/resume";
import Link from "next/link";
import { getAllResumes } from "@/lib/storage";

async function getResumes(): Promise<Resume[]> {
    try {
        const resumes = await getAllResumes();
        return resumes;
    } catch (error) {
        console.error("Error fetching resumes:", error);
        return [];
    }
}

export default async function Home() {
    const resumes = await getResumes();

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

                {resumes.length > 0 ? (
                    <section className="animate-fade-in">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                                    Your Resumes
                                </h2>
                                <p className="text-gray-600 font-light">
                                    Manage and edit your professional resumes
                                </p>
                            </div>
                            <div className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg font-semibold text-sm">
                                {resumes.length}{" "}
                                {resumes.length === 1 ? "Resume" : "Resumes"}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map((resume, index) => (
                                <Link
                                    key={resume.id}
                                    href={`/resume/${resume.id}`}
                                    className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-red-200"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                            {resume.personalInfo.fullName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <svg
                                            className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                        {resume.personalInfo.fullName}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {resume.personalInfo.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            {resume.personalInfo.location}
                                        </div>
                                    </div>

                                    {resume.experience &&
                                        resume.experience.length > 0 && (
                                            <div className="bg-red-50 p-3 rounded-lg mb-4 border border-red-100">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {
                                                        resume.experience[0]
                                                            .position
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    at{" "}
                                                    {
                                                        resume.experience[0]
                                                            .company
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                        <span className="flex items-center gap-1">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {new Date(
                                                resume.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <span className="text-red-600 font-medium group-hover:underline">
                                            View Resume →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200 animate-fade-in">
                        <div className="mb-6 relative inline-block">
                            <div className="absolute inset-0 bg-red-200 rounded-full blur-2xl opacity-30"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-10 h-10 text-red-600"
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
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                            Ready to Start Your Journey?
                        </h3>
                        <p className="text-base text-gray-600 mb-8 max-w-md mx-auto font-light">
                            Create your first professional resume and take the
                            first step towards your dream career
                        </p>

                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 font-semibold text-base group"
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
                            Create Your First Resume
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
                    </div>
                )}

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
