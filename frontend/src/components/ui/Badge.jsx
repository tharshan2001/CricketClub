// src/components/ui/Badge.jsx
const Badge = ({ children, className }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
};

export default Badge;