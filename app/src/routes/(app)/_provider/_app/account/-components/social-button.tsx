interface SocialButtonProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function SocialButton({ name, icon, onClick }: SocialButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 btn btn-outline hover:btn-accent h-12"
      aria-label={`Share on ${name}`}
    >
      {icon}
    </button>
  );
}

export default SocialButton;
