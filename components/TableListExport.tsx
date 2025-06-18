"use client";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { FileText, Printer } from "lucide-react";

const stripHtmlTags = (htmlString: string) => {
  return htmlString
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n/g, ", ")
    .trim();
};

interface MetaColumn {
  key: string;
  content: string;
  export?: boolean;
  render?: (row: any) => React.ReactNode;
}

interface TableListExportProps {
  fileName: string;
  data: any[];
  meta: MetaColumn[];
  selectedOptions: number[];
}

export default function TableListExport({
  fileName,
  data,
  meta,
  selectedOptions,
}: TableListExportProps) {
  const exportToExcel = () => {
    const worksheetData = [
      [
        "#",
        ...meta.map((col, i) =>
          col.export !== false && !selectedOptions.includes(i)
            ? col.content
            : ""
        ),
      ],
      ...data.map((row, index) => [
        index + 1,
        ...meta.map((col, i) => {
          if (col.export === false || selectedOptions.includes(i)) {
            return "";
          }

          if (col.render) {
            const rendered = col.render(row);
            if (typeof rendered === "string") return rendered;
            if (React.isValidElement(rendered)) {
              return stripHtmlTags(
                ReactDOMServer.renderToStaticMarkup(rendered)
              );
            } else return (rendered as any)?.props?.children || "-";
          }
          return row[col.key] || "";
        }),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, `${fileName}.xlsx`);
  };

  const print = () => {
    let tableHTML = `<table>
      <thead>
        <tr>
          <th>#</th>
          ${meta
            .map((col, i) =>
              col.export !== false && !selectedOptions.includes(i)
                ? `<th>${col.content}</th>`
                : ""
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (row, index) => `
              <tr>
                <td>${index + 1}</td>
                ${meta
                  .map((col, i) => {
                    if (col.export === false || selectedOptions.includes(i)) {
                      return "";
                    }
                    let value = row[col.key] || "";
                    if (col.render) {
                      const rendered = col.render(row);
                      if (typeof rendered === "string") value = rendered;
                      if (React.isValidElement(rendered)) {
                        value = ReactDOMServer.renderToStaticMarkup(rendered);
                      } else value = (rendered as any)?.props?.children || "-";
                    }
                    return `<td>${value}</td>`;
                  })
                  .join("")}
              </tr>`
          )
          .join("")}
      </tbody>
    </table>`;

    const newWindow = window.open("", "_blank");
    if (!newWindow) return;
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
           <style>
            @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
            * { color: #000 !important;}
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid black; padding: 10px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            tr:hover { background-color: #ddd; }
            @media print {
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          ${tableHTML}
          <script>
            window.onload = function() {
              window.print();
            };
            window.onafterprint = function() { window.close(); };
          <\/script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={exportToExcel}
        className="h-7 text-sm px-1 border border-green-700 text-green-700 dark:border-green-500 dark:text-green-500 rounded shadow-sm hover:text-green-800 transition-all duration-200 flex items-center gap-1"
      >
        <FileText size={16} />
        Excel
      </button>

      <button
        type="button"
        onClick={print}
        className="h-7 text-sm px-1 border border-blue-600 text-blue-600 rounded shadow-sm hover:text-blue-700 transition-all duration-200 flex items-center gap-1"
      >
        <Printer size={16} />
        Print
      </button>
    </div>
  );
}
