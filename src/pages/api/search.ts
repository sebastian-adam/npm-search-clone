// Define types for the data returned from the API
export interface Package {
  name: string;
  scope: string;
  version: string;
  description: string;
  keywords: string[];
  date: string;
  links: {
    npm: string;
    homepage: string;
    repository: string;
    bugs: string;
  };
  author: {
    name: string;
    email: string;
    url: string;
  };
  publisher: {
    username: string;
    email: string;
  };
  maintainers: {
    username: string;
    email: string;
  }[];
}

interface ScoreDetail {
  quality: number;
  popularity: number;
  maintenance: number;
}

export interface SearchResult {
  package: Package;
  score: {
    final: number;
    detail: ScoreDetail;
  };
  searchScore: number;
  highlight: string;
}
