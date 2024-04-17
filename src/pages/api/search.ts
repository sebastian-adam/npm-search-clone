import { NextApiRequest, NextApiResponse } from "next";

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

// GET request to external API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;
  const apiUrl = `https://api.npms.io/v2/search/suggestions?q=${query}`;

  try {
    const response = await fetch(apiUrl);
    const data: SearchResult[] = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json([]);
    console.error("External api error:", error);
  }
}
