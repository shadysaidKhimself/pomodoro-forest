

interface ImmersiveBackgroundProps {
  status: string;
}

export default function ImmersiveBackground({ status }: ImmersiveBackgroundProps) {
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${status === 'RUNNING' ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="absolute inset-0 bg-cover bg-center animate-walk"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}forest-path.jpg')` }}
      />
      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F1A]/80 via-transparent to-[#1A2F1A]/90" />
    </div>
  );
}
