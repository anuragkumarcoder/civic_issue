import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([
    // Sample data for demonstration
    {
      id: '1',
      title: 'Pothole on Main Street',
      description: 'Large pothole causing traffic hazards',
      location: '123 Main St, Cityville',
      status: 'REPORTED',
      category: 'ROADS',
      upvotes: 15,
      createdAt: '2023-05-01T12:00:00Z',
      reporter: {
        name: 'John Doe',
      },
    },
    {
      id: '2',
      title: 'Broken Street Light',
      description: 'Street light not working for past week',
      location: '456 Oak Ave, Cityville',
      status: 'IN_PROGRESS',
      category: 'ELECTRICITY',
      upvotes: 8,
      createdAt: '2023-05-02T14:30:00Z',
      reporter: {
        name: 'Jane Smith',
      },
    },
    {
      id: '3',
      title: 'Garbage Collection Missed',
      description: 'Garbage not collected for two weeks',
      location: '789 Pine Rd, Cityville',
      status: 'UNDER_REVIEW',
      category: 'SANITATION',
      upvotes: 12,
      createdAt: '2023-05-03T09:15:00Z',
      reporter: {
        name: 'Mike Johnson',
      },
    },
  ]);

  return (
    <div>
      <Head>
        <title>Civic Issue Reporting System</title>
        <meta name="description" content="Report and track civic issues in your community" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Report Civic Issues in Your Community
              </h1>
              <p className="text-xl mb-8">
                Help improve your neighborhood by reporting issues like potholes, broken streetlights,
                garbage collection problems, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/issues/report"
                  className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-colors"
                >
                  Report an Issue
                </Link>
                <Link
                  href="/issues"
                  className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-md font-medium text-lg transition-colors"
                >
                  Browse Issues
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Report an Issue</h3>
                <p className="text-gray-600">
                  Submit details about the civic issue you've encountered, including location and photos.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Officials Review</h3>
                <p className="text-gray-600">
                  Local government officials review and prioritize the reported issues.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                <p className="text-gray-600">
                  Follow the status of your reported issues from submission to resolution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Issues */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Recent Issues</h2>
              <Link
                href="/issues"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                View All <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to make a difference?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community of active citizens working together to improve our neighborhoods.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-md font-medium text-lg transition-colors"
                >
                  Log In
                </Link>
              </div>
            ) : (
              <Link
                href="/issues/report"
                className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-colors"
              >
                Report an Issue
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}