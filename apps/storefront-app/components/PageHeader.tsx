import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface PageHeaderProps {
  icon: IconDefinition;
  title: string;
  subtitle?: any;
  badge?: {
    count: number;
    label: string;
  };
  iconGradient?: string;
  titleGradient?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  subtitle,
  badge,
  iconGradient = 'from-indigo-500 to-purple-500',
  titleGradient = 'from-indigo-600 to-purple-600',
}) => {
  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <div className={`p-4 bg-gradient-to-br ${iconGradient} rounded-2xl shadow-lg`}>
              <FontAwesomeIcon icon={icon} className="w-5 h-5 text-white" />
            </div>
            <h1
              className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}
            >
              {title}
            </h1>
          </div>
          {(subtitle || badge) && (
            <div className="text-gray-700 mt-3 text-lg font-medium flex items-center gap-2">
              {badge && (
                <span
                  className={`w-8 h-8 bg-gradient-to-br ${iconGradient} rounded-full flex items-center justify-center text-white font-bold`}
                >
                  {badge.count}
                </span>
              )}
              {subtitle || (badge && `${badge.label}`)}
            </div>
          )}
        </div>
      </div>
  );
};
