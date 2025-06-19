import React, { useEffect, useState, useMemo, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardListProps<T> {
  className?: string;
  render: (item: T) => ReactNode;
  data: T[];
  pageLength: number;
}

/**
 * CardList: generic paginated card grid (search removed)
 */
const CardList = <T extends Record<string, any>>({
  className = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4",
  render,
  data,
  pageLength,
}: CardListProps<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = data.length > 0 ? Math.ceil(data.length / pageLength) : 1;

  const dataDisplay = useMemo(() => {
    return data.slice((currentPage - 1) * pageLength, currentPage * pageLength);
  }, [data, currentPage, pageLength]);

  useEffect(() => {
    if (dataDisplay.length === 0 && currentPage !== 1) setCurrentPage(1);
  }, [dataDisplay.length, currentPage]);

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-2"></div>
        {/* (search removed) */}
      </div>
      <div className={className}>
        {dataDisplay.length > 0 ? (
          dataDisplay.map((item: T, index: number) => (
            <div key={index}>{render(item)}</div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 mb-2 text-gray-300 dark:text-gray-500"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M6 8h10v2H6zm0 4h8v2H6zm0 4h4v2H6z"
                />
                <path
                  fill="currentColor"
                  d="M28 26H7.414L30 3.414L28.586 2l-2 2H4a2 2 0 0 0-2 2v16h2V6h20.586L2 28.586L3.414 30l2-2H28a2 2 0 0 0 2-2V10h-2Z"
                />
              </svg>
              <i className="text-sm text-gray-300 dark:text-gray-700">
                ไม่มีข้อมูล
              </i>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          ทั้งหมด {data.length} รายการ
        </p>
        {data.length > pageLength && (
          <div className="flex items-center justify-between gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-300 pr-2">
              หน้า {currentPage} / {totalPages}
            </p>
            <button
              className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 rounded-md disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" size={16} />
            </button>
            <button
              className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 rounded-md disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CardList;
