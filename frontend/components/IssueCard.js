import Link from 'next/link';
import { CalendarIcon, MapPinIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const categoryIcons = {
  ROADS: '🛣️',
  WATER: '💧',
  ELECTRICITY: '⚡',
  SANITATION: '🗑️',
  PUBLIC_SAFETY: '🚨',
  ENVIRONMENT: '🌳',
  PUBLIC_PROPERTY: '🏢',
  OTHER: '📋',
};

const statusColors = {
  REPORTED: 'badge-reported',
  UNDER_REVIEW: 'badge-under-review',
  IN_PROGRESS: 'badge-in-progress',
  RESOLVED: 'badge-resolved',
  CLOSED: 'badge-closed',
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function IssueCard({ issue }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`badge ${statusColors[issue.status]}`}>{issue.status.replace('_', ' ')}</span>
          <span className="text-2xl">{categoryIcons[issue.category]}</span>
        </div>
        <Link href={`/issues/${issue.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors">
            {issue.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="truncate">{issue.location}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formatDate(issue.createdAt)}</span>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Reported by <span className="font-medium">{issue.reporter.name}</span>
        </div>
        <button className="flex items-center text-gray-500 hover:text-primary-600 transition-colors">
          <ArrowUpIcon className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{issue.upvotes}</span>
        </button>
      </div>
    </div>
  );
}