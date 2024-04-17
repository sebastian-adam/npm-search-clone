import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { Autocomplete, Button, TextField } from "@mui/material";
import Image from "next/image";
import npmLogo from "../../public/images/npm.svg";
import type { SearchResult } from "./api/search";
import { firaMono } from "../theme";

const Home = () => {
  ///
  /// Autocomplete state
  ///
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fetchingDropdownResults, setFetchingDropdownResults] =
    useState<boolean>(true);
  const [dropdownResults, setDropdownResults] = useState<SearchResult[]>([]);

  ///
  /// Navigation
  ///

  const router = useRouter();

  ///
  /// Fetch data
  ///

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
    setFetchingDropdownResults(true);
    // Debounce search to improve UX
    const timeoutId = setTimeout(async () => {
      const results = await fetchPackages(searchQuery);
      setDropdownResults(results || []);
      setFetchingDropdownResults(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Upon clicking a list item, redirect to dedicated page
  // Note: packageNames that contain `/` break NextJs routing magic
  // TODO: Find a better unique id for package routes
  const onClickListItem = (packageName: string) => {
    router.push(`/packages/${packageName.replace("/", "")}`);
  };

  const getAutocompleteOptions = dropdownResults?.map((result) => ({
    label: result.package.name,
  }));

  const noDropdownResults =
    !fetchingDropdownResults && searchQuery && !dropdownResults.length;

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
            noOptionsText={noDropdownResults ? "No results found" : "..."}
            forcePopupIcon={false}
            options={getAutocompleteOptions}
            onChange={(_, value) => value && onClickListItem(value.label)}
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
