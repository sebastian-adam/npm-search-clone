import { useState, useEffect, ChangeEvent } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import Image from "next/image";
import npmLogo from "../../public/images/npm.svg";
import type { SearchResult } from "./api/search";
import { firaMono } from "../theme";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dropdownResults, setDropdownResults] = useState<SearchResult[]>([]);

  const fetchPackages = async (query: string) => {
    if (query) {
      try {
        const response = await fetch(`/api/search?query=${query}`);
        const data: SearchResult[] = await response.json();
        return data;
      } catch (error) {
        console.error("Internal api error:", error);
        return [];
      }
    }
  };

  // Check if the user input changed on keypress
  const onKeypress = (e: ChangeEvent<HTMLInputElement>) => {
    // Don't make redundant api calls for trailing spaces
    const trimmedSearch = e.target.value.trim();

    if (trimmedSearch !== searchQuery) setSearchQuery(e.target.value);
  };

  // When the user input changes, refresh the dropdown data
  useEffect(() => {
    // Debounce search to improve UX
    const timeoutId = setTimeout(async () => {
      const results = await fetchPackages(searchQuery);
      setDropdownResults(results || []);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const getAutocompleteOptions = dropdownResults?.map((result) => ({
    label: result.package.name,
  }));

  return (
    <div className="h-screen flex flex-col">
      <div className="p-8 flex flex-row justify-center items-center space-x-4">
        <Image width={100} priority src={npmLogo} alt="npm Logo" />
        <div className="flex flex-1">
          <Autocomplete
            id="npm-search"
            className="flex-1"
            disablePortal
            open={!!searchQuery}
            noOptionsText={"..."}
            forcePopupIcon={false}
            options={getAutocompleteOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                type="text"
                value={searchQuery}
                onChange={onKeypress}
                placeholder="Search for packages..."
                InputProps={{
                  ...params.InputProps,
                  style: { fontFamily: firaMono.style.fontFamily },
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
