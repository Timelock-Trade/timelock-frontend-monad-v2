"use client";

import { usePositionsTableData } from "@/hooks/usePositionsTableData";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";
import columns from "./Columns";
import { useAccount } from "wagmi";
import { ErrorIcon } from "@/icons";

export default function Tables() {
  const { data: positions, isLoading, error } = usePositionsTableData();
  const { isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const positionsData = positions?.positions?.sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const table = useReactTable({
    data: useMemo(() => {
      if (!positionsData) return [];
      return positionsData;
    }, [positionsData]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderTable = () => {
    // Always show loading initially to prevent hydration mismatch
    if (!isMounted) {
      return (
        <div className="text-[#9CA3AF] text-xs flex justify-center items-center h-[200px] italic">
          Loading...
        </div>
      );
    }

    if (!isConnected) {
      return (
        <div className="text-[#9CA3AF] text-xs flex justify-center items-center h-[200px] italic">
          Connect wallet to see your positions
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-[#9CA3AF] text-xs flex justify-center items-center h-[200px] italic">
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-[#9CA3AF] text-xs flex justify-center items-center h-[200px] italic flex-row gap-2">
          <ErrorIcon /> Failed to load positions
        </div>
      );
    }

    if (!positionsData || positionsData?.length === 0) {
      return (
        <div className="text-[#9CA3AF] text-xs flex justify-center items-center h-[200px] italic">
          Open your first position to get started{" "}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[#1A1A1A]">
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`py-4 text-left text-sm text-[#9CA3AF] ${
                      index === 0 ? "pl-6" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#1A1A1A] hover:bg-[#1A1A1A]/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="font-semibold text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderClosedPositions = () => {
    // Mirror the loading and connection states for consistency
    if (!isMounted) {
      return (
        <div className="text-[#9CA3AF] text-xs flex justify-center items-center h-[200px] italic">
          Loading...
        </div>
      );
    }

    if (!isConnected) {
      return (
        <div className="text-[#9CA3AF] text-xs flex justify-center items-center h-[200px] italic">
          Connect wallet to see your closed positions
        </div>
      );
    }

    // Placeholder until closed positions data source is available
    return (
      <div className="text-[#9CA3AF] text-xs flex justify-center items-center h-[200px] italic">
        No closed positions to show
      </div>
    );
  };

  return (
    <div className="border border-[#1A1A1A] rounded-md mt-4 relative">
      <div className="flex flex-row items-center border-b border-[#1A1A1A] gap-6 pl-6 ">
        <button
          className={`text-sm font-semibold py-4 outline-none relative cursor-pointer transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-[width,opacity] after:duration-200 after:ease-out ${
            activeTab === "open"
              ? "text-white after:w-full after:opacity-100"
              : "text-white/60 hover:text-white after:w-0 after:opacity-0"
          }`}
          onClick={() => setActiveTab("open")}
        >
          Open Positions
        </button>
        <button
          className={`text-sm font-semibold py-4 outline-none relative cursor-pointer transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-[width,opacity] after:duration-200 after:ease-out ${
            activeTab === "closed"
              ? "text-white after:w-full after:opacity-100"
              : "text-white/60 hover:text-white after:w-0 after:opacity-0"
          }`}
          onClick={() => setActiveTab("closed")}
        >
          Closed Positions
        </button>
      </div>
      {activeTab === "open" ? renderTable() : renderClosedPositions()}
    </div>
  );
}
