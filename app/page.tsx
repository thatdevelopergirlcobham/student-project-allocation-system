import Link from "next/link";
import { BookOpen, GraduationCap, UserCog, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  const portalLinks = [
    {
      title: "Student Portal",
      description: "Access your projects, submit progress reports, and view feedback from your supervisor.",
      icon: <GraduationCap className="w-10 h-10 mb-4 text-blue-600" />,
      href: "/student/login",
      cta: "Login",
      secondaryCta: "Register",
      secondaryHref: "/student/register",
    },
    {
      title: "Supervisor Portal",
      description: "Manage projects, review student submissions, and provide valuable feedback.",
      icon: <UserCog className="w-10 h-10 mb-4 text-blue-600" />,
      href: "/supervisor/login",
      cta: "Login",
    },
    {
      title: "Admin Portal",
      description: "Oversee the entire system, manage users, and run project allocations.",
      icon: <BookOpen className="w-10 h-10 mb-4 text-blue-600" />,
      href: "/admin/login",
      cta: "Login",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 sm:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Student Project Allocation and Management System
            </h1>
            <p className="text-lg text-slate-600 mb-10">
              Streamlining the process of project allocation for students, supervisors, and administrators.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/student/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <UserPlus className="w-5 h-5" />
                Student Registration
              </Link>
              <Link
                href="/student/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Access Your Portal</h2>
            <p className="mt-3 text-lg text-slate-600">Select your role to get started.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {portalLinks.map((portal, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl border border-slate-200 transition-all duration-300 hover:border-blue-500 hover:shadow-lg"
              >
                <div className="text-center flex flex-col h-full">
                  <p className='text-center flex flex-col'>{portal.icon}</p>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">{portal.title}</h3>
                  <p className="text-slate-600 mb-6 flex-grow">{portal.description}</p>
                  <div className="flex flex-col space-y-3 mt-auto">
                    <Link
                      href={portal.href}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
                    >
                      {portal.cta}
                    </Link>
                    {portal.secondaryCta && portal.secondaryHref && (
                      <Link
                        href={portal.secondaryHref}
                        className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center font-medium"
                      >
                        {portal.secondaryCta}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}