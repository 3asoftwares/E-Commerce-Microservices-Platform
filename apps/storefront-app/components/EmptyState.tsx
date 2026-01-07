import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface EmptyStateProps {
  icon: IconDefinition;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  iconColor = 'text-gray-600',
  iconBgColor = 'from-gray-100 to-gray-200',
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-20 text-center border border-gray-200">
      <div className={`inline-block p-6 bg-gradient-to-br ${iconBgColor} rounded-full mb-6`}>
        <FontAwesomeIcon icon={icon} className={`w-20 h-20 ${iconColor}`} />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-10 text-lg max-w-md mx-auto">
        {description}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-block px-10 py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-gray-500/50 transition-all transform hover:scale-105 hover:-translate-y-1"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
