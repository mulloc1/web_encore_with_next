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
    // return (
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
    //     {data.map((job: any) => (
    //       <JobCard key={job.id} job={job} />
    //     ))}
    //   </div>
    // );
    // console.log(data);
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

  useEffect(() => {
    fetchJobs({ page, filter }).then((jobs) => {
      console.log("전체 데이터:", jobs);
      setJobs((_) => [...jobs]);
    });
  }, [page]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
        {jobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setPage(page - 1); // 그 다음 페이지 값 증가
            console.log(page); // 현재 페이지 값 먼저 출력
          }}
        >
          이전
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setPage(page + 1); // 그 다음 페이지 값 증가
            console.log(page); // 현재 페이지 값 먼저 출력
          }}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
