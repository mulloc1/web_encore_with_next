"use client";

import FilterTags from "./filter-tags";
import JobGrid from "./job-grid";
import { useState } from "react";
import HeroSection from "./hero-section";

export default function Board() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>({
    sd: "",
    sgg: "",
    category: "",
    majorName: "",
  });

  return (
    <div>
      <HeroSection setFilter={setFilter} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* <FilterTags filter={filter} setFilter={setFilter} /> */}
        <JobGrid filter={filter} page={page} setPage={setPage} />
      </main>
    </div>
  );
}
