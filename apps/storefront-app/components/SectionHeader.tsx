interface SectionHeaderProps {
  badge?: {
    icon: React.ReactNode;
    text: string;
    bgColor?: string;
    textColor?: string;
  };
  title: string;
  description?: string;
  titleGradient?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  titleGradient = 'from-indigo-600 to-pink-600',
}) => {
  return (
    <div className="mb-12 text-center">
      {badge && (
        <div className={`inline-block px-4 py-2 ${badge.bgColor || 'bg-indigo-100'} ${badge.textColor || 'text-indigo-700'} rounded-full text-sm font-semibold mb-4`}>
          {badge.icon}
          {badge.text}
        </div>
      )}
      <h2 className={`text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r ${titleGradient}`}>
        {title}
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};
