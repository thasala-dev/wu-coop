import { Loader2 } from "lucide-react";
export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm">
        <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
        <p className="text-green-600">กำลังโหลด...</p>
      </div>
    </>
  );
}
