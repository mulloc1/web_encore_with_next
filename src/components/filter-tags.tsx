"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function FilterTags({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}) {
  // 호버 상태 관리
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // 필터 삭제 가능 여부 확인
  const canDeleteFilter = (key: string) => {
    if (key === "category") {
      return !filter.majorName; // majorName이 없을 때만 category 삭제 가능
    }
    if (key === "sd") {
      return !filter.sgg; // sgg가 없을 때만 sd 삭제 가능
    }
    return true; // 다른 필터는 항상 삭제 가능
  };

  return (
    <div className="py-4 overflow-x-auto">
      <div className="flex flex-wrap gap-2 md:flex-nowrap">
        {Object.entries(filter).map(([key, value], index) => {
          if (!value) return null;
          return (
            <div
              key={index}
              className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 hover-lift ${
                key === "sd" || key === "sgg"
                  ? "bg-white/90 text-gray-900 border-gray-200 hover:bg-white"
                  : "bg-emerald-700 dark:bg-[#a7d7c5] text-white dark:text-black border-emerald-600 dark:border-[#8fcbb6] hover:bg-emerald-600 dark:hover:bg-[#8fcbb6]"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredId(index)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {value}
              {hoveredId === index && canDeleteFilter(key) && (
                <button
                  className="ml-1.5 text-current opacity-70 hover:opacity-100"
                  onClick={() => {
                    const newFilter = { ...filter };
                    newFilter[key as keyof Filter] = "";
                    setFilter(newFilter);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
