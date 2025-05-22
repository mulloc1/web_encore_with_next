interface Job {
  id: string;
  writeNumber: number;
  source: string;
  url: string;
  createdAt: string;
  mainTitle: string;
  subTitle: string;
  pay: string;
  schedule: string;
  isSubstitude: boolean;
  isPlayedOnce: boolean;
  major: Major[];
  locale: Locale[];
}

interface Major {
  category: string;
  majorName: string;
}

interface Locale {
  sd: string;
  sgg: string;
}
