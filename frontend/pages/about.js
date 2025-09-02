import Head from 'next/head';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  LightBulbIcon, 
  DocumentTextIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function About() {
  return (
    <>
      <Head>
        <title>About | Civic Issue Reporting System</title>
        <meta name="description" content="Learn about our civic issue reporting platform and how we're working to improve communities." />
      </Head>

      <div className="bg-white">
        {/* Hero section */}
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
          <div className="absolute inset-0">
            <svg
              className="absolute bottom-0 left-0 right-0 text-white"
              viewBox="0 0 1440 320"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          <div className="relative pt-16 pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
              About Our Platform
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-white">
              Empowering citizens to report and resolve civic issues in their communities.
            </p>
          </div>
        </div>

        {/* Mission section */}
        <div className="py-16 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Our Mission</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Building better communities together
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                We believe that engaged citizens are the foundation of thriving communities. Our platform connects residents, local governments, and service providers to address civic issues efficiently.
              </p>
            </div>

            <div className="mt-16">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Community Engagement</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We foster active participation from all community members, creating a collaborative environment for problem-solving and civic improvement.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <LightBulbIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Innovative Solutions</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Our platform leverages technology to streamline the reporting, tracking, and resolution of civic issues, making the process more efficient for everyone involved.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <DocumentTextIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Transparency</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We believe in open communication and accountability. Our platform provides clear visibility into the status of reported issues and the actions being taken to address them.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <MapPinIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Local Focus</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We understand that each community has unique challenges and priorities. Our platform is designed to address the specific needs of your local area.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How It Works</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Simple, effective issue reporting
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">The Process</span>
              </div>
            </div>

            <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4 mx-auto">
                      <DocumentTextIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 text-center">1. Report an Issue</h3>
                    <p className="mt-3 text-base text-gray-500 text-center">
                      Submit details about the civic issue you've encountered, including location, category, and photos if available.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4 mx-auto">
                      <ChatBubbleLeftRightIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 text-center">2. Track Progress</h3>
                    <p className="mt-3 text-base text-gray-500 text-center">
                      Follow the status of your reported issue as it moves through review, assignment, and resolution phases.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4 mx-auto">
                      <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 text-center">3. Issue Resolved</h3>
                    <p className="mt-3 text-base text-gray-500 text-center">
                      Receive notifications when your issue has been addressed, and provide feedback on the resolution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team section */}
        <div className="bg-white py-16">
          <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
            <div className="space-y-12">
              <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Our Team</h2>
                <p className="text-xl text-gray-500">
                  Meet the dedicated professionals working to make our communities better places to live.  
                </p>
              </div>
              <ul className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8">
                <li>
                  <div className="space-y-4">
                    <div className="aspect-w-3 aspect-h-2">
                      <div className="h-48 w-full bg-primary-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="h-24 w-24 text-primary-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg leading-6 font-medium space-y-1">
                        <h3>Sarah Johnson</h3>
                        <p className="text-primary-600">Founder & CEO</p>
                      </div>
                      <div className="text-lg">
                        <p className="text-gray-500">Urban planner with 15+ years of experience in community development and civic engagement.</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="space-y-4">
                    <div className="aspect-w-3 aspect-h-2">
                      <div className="h-48 w-full bg-primary-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="h-24 w-24 text-primary-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg leading-6 font-medium space-y-1">
                        <h3>Michael Chen</h3>
                        <p className="text-primary-600">CTO</p>
                      </div>
                      <div className="text-lg">
                        <p className="text-gray-500">Software engineer specializing in civic tech solutions and community-driven platforms.</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="space-y-4">
                    <div className="aspect-w-3 aspect-h-2">
                      <div className="h-48 w-full bg-primary-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="h-24 w-24 text-primary-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg leading-6 font-medium space-y-1">
                        <h3>Aisha Patel</h3>
                        <p className="text-primary-600">Community Relations</p>
                      </div>
                      <div className="text-lg">
                        <p className="text-gray-500">Public policy expert focused on building partnerships between citizens and local governments.</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-primary-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Join our community today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-200">
              Be part of the solution. Report issues, track progress, and help improve your community.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link href="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50">
                  Sign up for free
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link href="/issues" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-800">
                  View Issues
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}