"use client";

import JobCard from "./job-card";
import JobCardSkeleton from "./job-card-skeleton";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

async function fetchJobs({ page, filter }: { page: number; filter: Filter }) {
  try {
    // 환경 변수가 없을 경우를 대비한 체크
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error("환경 변수가 설정되지 않았습니다");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/getAllArchiveBoard?page=${page}&sd=${filter.sd}&sgg=${filter.sgg}&category=${filter.category}&majorName=${filter.majorName}`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("데이터를 불러오는데 실패했습니다");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("데이터 불러오기 오류:", error);
    return [];
  }
}

export default function JobGrid({
  filter,
  page,
  setPage,
}: {
  filter: Filter;
  page: number;
  setPage: (page: number) => void;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const newJobs = await fetchJobs({ page, filter });
        console.log("필터:", filter);
        console.log("전체 데이터:", newJobs);
        setJobs(newJobs);
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [page, filter]); // filter를 의존성 배열에 추가

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
        {isLoading ? (
          // 로딩 중일 때 스켈레톤 UI 표시
          Array.from({ length: 8 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))
        ) : jobs.length > 0 ? (
          // 데이터가 있을 때
          jobs.map((job) => <JobCard key={job.id} {...job} />)
        ) : (
          // 데이터가 없을 때
          <div className="col-span-full text-center py-8 text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setPage(page - 1)}
          disabled={page === 0 || isLoading}
        >
          이전
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setPage(page + 1)}
          disabled={jobs.length === 0 || isLoading}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
