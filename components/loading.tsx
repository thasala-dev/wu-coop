export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/1 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 mb-4" />
      <p className="text-green-600 font-semibold">กำลังโหลด...</p>
    </div>
  );
}
