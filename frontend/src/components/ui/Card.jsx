// src/components/ui/Card.jsx
const Card = ({ children, className }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;