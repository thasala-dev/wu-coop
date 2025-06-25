import React, { useState, useEffect, useMemo, useRef, ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Squirrel,
  TentTree,
  TreePalm,
  Turtle,
  XCircle,
} from "lucide-react";
import TableListExport from "./TableListExport";

// Type for meta column
export interface TableMeta<T = any> {
  key: string;
  content: string;
  width?: number | string;
  className?: string;
  sort?: boolean;
  render?: (item: T) => ReactNode;
}

interface TableListProps<T = any> {
  data: T[];
  meta: TableMeta<T>[];
  loading?: boolean;
  exports?: boolean;
  disableSearch?: boolean;
  customSearchSlot?: ReactNode;
  setItemLenge?: string;
}

const iconList = [
  <TentTree className="w-12 h-12 text-emerald-200 dark:text-gray-500" />,
  <Squirrel className="w-12 h-12 text-emerald-200 dark:text-gray-500" />,
  <TreePalm className="w-12 h-12 text-emerald-200 dark:text-gray-500" />,
  <Turtle className="w-12 h-12 text-emerald-200 dark:text-gray-500" />,
];

const TableList = <
  T extends { id?: string | number } & { [key: string]: any }
>({
  data,
  meta,
  loading = false,
  exports,
  disableSearch,
  customSearchSlot,
  setItemLenge,
}: TableListProps<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<{ key: string; order: "asc" | "desc" | "" }>(
    { key: "", order: "" }
  );
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    Number(setItemLenge) || 20
  );

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSelection = (option: number) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedItems = localStorage.getItem("@itemsPerPage");
      if (storedItems) {
        setItemsPerPage(Number(storedItems));
      }
    }

    if (setItemLenge) {
      const numValue = Number(setItemLenge);
      setItemsPerPage(numValue);
    }
  }, []);

  const updateItemsPerPage = (value: number | string) => {
    const numValue = Number(value);
    setItemsPerPage(numValue);
    localStorage.setItem("@itemsPerPage", String(numValue));
  };

  const totalPages =
    data.length > 0 ? Math.ceil(data.length / itemsPerPage) : 1;

  const filteredSortedData = useMemo(() => {
    let result = [...data];

    if (search.trim() !== "") {
      result = result.filter((item) =>
        meta.some((m) =>
          item[m.key]?.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (sort.key !== "") {
      result.sort((a, b) =>
        sort.order === "asc"
          ? a[sort.key] > b[sort.key]
            ? 1
            : -1
          : a[sort.key] < b[sort.key]
          ? 1
          : -1
      );
    }

    return result;
  }, [data, search, sort, meta, itemsPerPage]);

  const dataDisplay = useMemo(() => {
    return filteredSortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredSortedData, currentPage, itemsPerPage]);

  useEffect(() => {
    if (dataDisplay.length === 0 && currentPage !== 1) setCurrentPage(1);
  }, [dataDisplay.length, currentPage]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-2">
          {exports !== false && (
            <TableListExport
              fileName="excel-export.xlsx"
              selectedOptions={selectedOptions}
              data={data}
              meta={meta}
            />
          )}
        </div>
        <div className="flex gap-1">
          {!setItemLenge && (
            <div className="hidden md:flex gap-1 items-center">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300"></label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  updateItemsPerPage(e.target.value);
                }}
                className="w-30 h-7 text-sm px-3 py-1 border border-gray-300 rounded-md bg-white dark:bg-gray-800"
              >
                <option value={10}>10 รายการ/หน้า</option>
                <option value={20}>20 รายการ/หน้า</option>
                <option value={50}>50 รายการ/หน้า</option>
                <option value={100}>100 รายการ/หน้า</option>
              </select>
            </div>
          )}

          {/* เพิ่มการเช็ค disableSearch */}
          {disableSearch ? (
            customSearchSlot
          ) : (
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="ค้นหา..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 h-7 text-sm pr-8 pl-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white"
              />
              {search ? (
                <XCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4 cursor-pointer"
                  onClick={() => setSearch("")}
                  size={16}
                />
              ) : (
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4 "
                  size={16}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-x-auto">
        <div className="overflow-x-auto">
          <table
            id="myTable"
            className="min-w-full rounded-lg text-left text-sm"
          >
            <thead>
              <tr className="border-y border-gray-200 dark:border-gray-700 bg-emerald-50 dark:bg-gray-700">
                <th
                  style={{ width: 40 }}
                  className="border text-sm border-gray-200 dark:border-gray-700 px-1 py-3 text-center font-medium text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-600"
                >
                  <p className="flex items-center justify-center opacity-70">
                    #
                  </p>
                </th>
                {meta.map((m, index) =>
                  !selectedOptions.includes(index) ? (
                    <th
                      key={`header-${index}`}
                      style={m.width ? { width: m.width } : undefined}
                      className="border text-sm border-gray-200 dark:border-gray-700 px-1 py-3 text-center font-medium text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-600"
                    >
                      {m.sort === false ? (
                        <p className="flex items-center justify-center gap-1">
                          {m.content}
                        </p>
                      ) : (
                        <p
                          className="flex items-center justify-center gap-1 hover:text-gray-900 cursor-pointer dark:hover:text-white"
                          onClick={() => {
                            if (sort.key === m.key) {
                              setSort((prev) => ({
                                key: prev.key,
                                order: prev.order === "asc" ? "desc" : "asc",
                              }));
                            } else {
                              setSort({ key: m.key, order: "asc" });
                            }
                          }}
                        >
                          {m.content}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                            ></path>
                          </svg>
                        </p>
                      )}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr
                    key={`loading-${index}`}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="p-3 text-center">
                      <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-4 w-8 mx-auto rounded-md"></div>
                    </td>

                    {meta.map((_, i) =>
                      !selectedOptions.includes(i) ? (
                        <td key={`loading-cell-${i}`} className="p-3">
                          <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-4 w-full rounded-md"></div>
                        </td>
                      ) : null
                    )}
                  </tr>
                ))
              ) : dataDisplay.length > 0 ? (
                dataDisplay.map((item, index) => {
                  const currentRow =
                    (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr
                      key={currentRow}
                      className="border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <td className="border border-gray-200 dark:border-gray-700 p-2 text-center text-gray-900 dark:text-gray-300">
                        {currentRow}
                      </td>
                      {meta.map((m, i) =>
                        !selectedOptions.includes(i) ? (
                          <td
                            key={`row-${currentRow}-col-${i}`}
                            className={[
                              "border border-gray-200 dark:border-gray-700 p-2 text-gray-900 dark:text-gray-300",
                              m.className || "",
                            ].join(" ")}
                          >
                            {m.render ? (
                              m.render(item)
                            ) : item[m.key] && item[m.key] !== "" ? (
                              item[m.key]
                            ) : (
                              <i className="text-xs text-gray-300 dark:text-gray-700">
                                (ไม่มีข้อมูล)
                              </i>
                            )}
                          </td>
                        ) : null
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr className="border border-gray-200 dark:border-gray-700">
                  <td colSpan={meta.length + 1} className="p-4">
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="flex flex-col items-center justify-center bg-emerald-50 w-20 h-20 rounded-full mb-2">
                        {iconList[Math.floor(Math.random() * iconList.length)]}
                      </div>
                      <i className="text-sm text-gray-400 dark:text-gray-700">
                        ไม่มีข้อมูล
                      </i>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          ทั้งหมด {data.length} รายการ
        </p>
        {data.length > itemsPerPage && (
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
    </div>
  );
};

export default TableList;
