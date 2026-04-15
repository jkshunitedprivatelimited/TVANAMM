export default function StudioLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#006437] z-[9999]">
      <div className="flex flex-col items-center gap-6">
        {/* Simple animated brand logo/placeholder */}
        <div className="w-20 h-20 rounded-full border-4 border-[#C8A96E]/20 border-t-[#C8A96E] animate-spin" />
        <div className="text-center">
          <h2 className="text-white font-playfair text-2xl font-bold tracking-widest mb-1 italic">T VANAMM</h2>
          <p className="text-[#C8A96E] text-[10px] uppercase tracking-[0.3em] font-bold">Content Studio Loading...</p>
        </div>
      </div>
      
      {/* Visual background details to match site look */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-white filter blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 rounded-full bg-[#C8A96E] filter blur-3xl" />
      </div>
    </div>
  );
}
