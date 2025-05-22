"use client";

import FilterTags from "./filter-tags";
import JobGrid from "./job-grid";
import { useState, useCallback } from "react";
import HeroSection from "./hero-section";

export default function Board() {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<Filter>({
    category: "",
    majorName: "",
    sd: "",
    sgg: "",
  });

  const handleFilterChange = useCallback(
    (newFilter: Filter) => {
      console.log("이전 필터:", filter);
      console.log("새로운 필터:", newFilter);
      setFilter(newFilter);
      setPage(0); // 필터가 변경될 때 페이지를 리셋
    },
    [filter]
  );

  return (
    <div>
      <HeroSection filter={filter} setFilter={handleFilterChange} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <FilterTags filter={filter} setFilter={setFilter} />
        <JobGrid filter={filter} page={page} setPage={setPage} />
      </main>
    </div>
  );
}
