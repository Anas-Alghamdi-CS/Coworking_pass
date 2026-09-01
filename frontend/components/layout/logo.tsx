export default function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Coworking Pass"
      className={`w-8 h-8 object-contain ${className}`}
    />
  );
}