import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { Autocomplete, Button, TextField } from "@mui/material";
import Image from "next/image";
import npmLogo from "../../public/images/npm.svg";
import type { SearchResult } from "./api/search";
import { firaMono } from "../theme";
import Loading from "@/components/Loading";
import ListItem from "@/components/ListItem";
import { usePathname, useSearchParams } from "next/navigation";

const Home = () => {
  ///
  /// Autocomplete state
  ///
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fetchingDropdownResults, setFetchingDropdownResults] =
    useState<boolean>(true);
  const [dropdownResults, setDropdownResults] = useState<SearchResult[]>([]);

  ///
  /// Table state
  ///

  const [fetchingTableResults, setFetchingTableResults] =
    useState<boolean>(true);
  const [tableResults, setTableResults] = useState<SearchResult[]>([]);

  ///
  /// Navigation
  ///

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParam = searchParams?.get("search");

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

  ///
  /// Initialize component
  ///

  // Use search query in url to set initial state
  // for simple state management and to support shareable urls
  useEffect(() => {
    async function fetchTableResults() {
      setFetchingTableResults(true);
      setSearchQuery("");
      const results = await fetchPackages(searchParam || "");
      setTableResults(results || []);
      setFetchingTableResults(false);
    }

    // Only attempt to fetch data once url param is available
    if (router.isReady) {
      fetchTableResults();
    }
  }, [searchParam, router]);

  // Build Autocomplete options
  const getAutocompleteOptions = dropdownResults?.map((result) => ({
    label: result.package.name,
  }));

  // Conditional variables
  const noDropdownResults =
    !fetchingDropdownResults && searchQuery && !dropdownResults.length;

  ///
  /// Watch for events
  ///

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

  // Upon submitting a search, update search query in url
  const onSubmitSearch = () => {
    router.push(`${pathname}?search=${searchQuery}`);
  };

  ///
  /// Render component
  ///

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
          <Button
            variant="contained"
            component="button"
            disabled={
              fetchingDropdownResults || !!noDropdownResults || !searchQuery
            }
            onClick={onSubmitSearch}
          >
            Search
          </Button>
        </div>
      </div>
      {(fetchingTableResults && <Loading />) || (
        <ul className="flex flex-col flex-1 w-screen px-8">
          {tableResults.map((result) => (
            <ListItem
              key={result.package.name}
              item={result.package}
              onClick={() => onClickListItem(result.package.name)}
            ></ListItem>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
