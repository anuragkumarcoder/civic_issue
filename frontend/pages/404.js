import Link from 'next/link';
import Head from 'next/head';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | Civic Issue Reporting System</title>
      </Head>
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">404</h1>
          <p className="mt-2 text-2xl font-bold text-gray-900 tracking-tight">Page not found</p>
          <p className="mt-2 text-base text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <HomeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Go back home
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="/issues"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all issues
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}