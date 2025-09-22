import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Input,
  Button,
  Stack,
  HStack,
  VStack,
  Text,
  Badge,
  Card,
  Field,
  NativeSelect,
  InputGroup,
  Collapsible,
  Flex,
  Separator,
} from "@chakra-ui/react";
import {
  HiSearch,
  HiX,
  HiFilter,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import type { SearchFilters } from "~/types/product";

interface SearchBarProps {
  filters: SearchFilters;
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  categories: string[];
  isLoading?: boolean;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({
  filters,
  onSearch,
  onReset,
  categories,
  isLoading = false,
}) => {
  const [localQuery, setLocalQuery] = useState(filters.query || "");
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef(filters);

  // Keep filters ref up to date
  filtersRef.current = filters;

  // Memoize the search function to prevent unnecessary re-renders
  const debouncedSearch = useCallback(
    (query: string) => {
      onSearch({ ...filtersRef.current, query });
    },
    [onSearch]
  );

  // Sync local query with filters prop when it changes externally
  useEffect(() => {
    if (filters.query !== localQuery) {
      setLocalQuery(filters.query || "");
    }
  }, [filters.query]);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localQuery !== filters.query) {
        debouncedSearch(localQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, filters.query, debouncedSearch]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query && filters.query.trim()) count++;
    if (filters.category && filters.category !== "All") count++;
    if (filters.minPrice !== undefined && filters.minPrice >= 0) count++;
    if (filters.maxPrice !== undefined && filters.maxPrice >= 0) count++;
    if (filters.inStock !== undefined) count++;
    if (filters.minRating !== undefined) count++;
    return count;
  }, [filters]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(event.target.value);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    onSearch({
      ...filters,
      category: value === "All" ? undefined : value,
    });
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = value === "" ? undefined : parseFloat(value);
    if (!isNaN(numValue || 0) || value === "") {
      onSearch({ ...filters, minPrice: numValue });
    }
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = value === "" ? undefined : parseFloat(value);
    if (!isNaN(numValue || 0) || value === "") {
      onSearch({ ...filters, maxPrice: numValue });
    }
  };

  const handleStockChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const stockValue = value === "" ? undefined : value === "true";
    onSearch({ ...filters, inStock: stockValue });
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const ratingValue = value === "" ? undefined : parseFloat(value);
    onSearch({ ...filters, minRating: ratingValue });
  };

  return (
    <Card.Root shadow="sm" borderRadius="lg">
      <Card.Body p={6}>
        <VStack gap={6} align="stretch">
          {/* Main Search Bar */}
          <Flex gap={4} align="center">
            <InputGroup
              flex="2"
              minW="300px"
              startElement={<HiSearch color="gray" size="20px" />}
            >
              <Input
                ref={inputRef}
                size="lg"
                placeholder="Search products by name, category, or description..."
                value={localQuery}
                onChange={handleInputChange}
                disabled={isLoading}
                role="searchbox"
                aria-label="Search products"
                bg="white"
                _focus={{
                  borderColor: "blue.500",
                  shadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
              />
            </InputGroup>

            {/* Right side controls - Category + Filter button */}
            <Flex flex="1" gap={3} align="center" justify="flex-end">
              {/* Quick Category Filter */}
              {categories.length > 0 && (
                <Field.Root flex="1" maxW="200px">
                  <NativeSelect.Root size="lg">
                    <NativeSelect.Field
                      value={filters.category || "All"}
                      onChange={handleCategoryChange}
                      aria-label="Category"
                      bg="white"
                    >
                      <option value="All">All Categories</option>
                      {categories
                        .filter((cat) => cat !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
              )}

              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                flexShrink="0"
              >
                <HiFilter />
                Filters
                {activeFilterCount > 0 && (
                  <Badge ml={2} colorPalette="blue" variant="solid">
                    {activeFilterCount}
                  </Badge>
                )}
                {showFilters ? <HiChevronUp /> : <HiChevronDown />}
              </Button>
            </Flex>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                colorPalette="red"
                size="lg"
                onClick={onReset}
              >
                <HiX />
                Clear All
              </Button>
            )}
          </Flex>

          {/* Collapsible Advanced Filters */}
          <Collapsible.Root open={showFilters}>
            <Collapsible.Content>
              <VStack gap={4} align="stretch">
                <Separator />

                {/* Price Range Section */}
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    mb={3}
                    color="gray.700"
                  >
                    Price Range
                  </Text>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label fontSize="xs" color="gray.600">
                        Min Price
                      </Field.Label>
                      <Input
                        type="number"
                        placeholder="$0"
                        value={filters.minPrice || ""}
                        onChange={handleMinPriceChange}
                        size="sm"
                        width="120px"
                        bg="white"
                      />
                    </Field.Root>

                    <Text mt={6} color="gray.400" fontSize="sm">
                      to
                    </Text>

                    <Field.Root>
                      <Field.Label fontSize="xs" color="gray.600">
                        Max Price
                      </Field.Label>
                      <Input
                        type="number"
                        placeholder="$999"
                        value={filters.maxPrice || ""}
                        onChange={handleMaxPriceChange}
                        size="sm"
                        width="120px"
                        bg="white"
                      />
                    </Field.Root>
                  </HStack>
                </Box>

                {/* Additional Filters */}
                <HStack gap={6} wrap="wrap">
                  {/* Stock Status */}
                  <Field.Root>
                    <Field.Label fontSize="xs" color="gray.600" mb={2}>
                      Stock Status
                    </Field.Label>
                    <NativeSelect.Root size="sm" width="140px">
                      <NativeSelect.Field
                        value={
                          filters.inStock === undefined
                            ? ""
                            : filters.inStock.toString()
                        }
                        onChange={handleStockChange}
                        aria-label="Stock Status"
                        bg="white"
                      >
                        <option value="">All Items</option>
                        <option value="true">In Stock Only</option>
                        <option value="false">Out of Stock</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>

                  {/* Minimum Rating */}
                  <Field.Root>
                    <Field.Label fontSize="xs" color="gray.600" mb={2}>
                      Minimum Rating
                    </Field.Label>
                    <NativeSelect.Root size="sm" width="140px">
                      <NativeSelect.Field
                        value={filters.minRating || ""}
                        onChange={handleRatingChange}
                        aria-label="Minimum Rating"
                        bg="white"
                      >
                        <option value="">Any Rating</option>
                        <option value="1">⭐ 1+ Stars</option>
                        <option value="2">⭐ 2+ Stars</option>
                        <option value="3">⭐ 3+ Stars</option>
                        <option value="4">⭐ 4+ Stars</option>
                        <option value="4.5">⭐ 4.5+ Stars</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                </HStack>

                {/* Active Filters Summary */}
                {activeFilterCount > 0 && (
                  <Box
                    p={3}
                    bg="blue.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="blue.200"
                  >
                    <Text fontSize="sm" color="blue.800" fontWeight="medium">
                      🔍 {activeFilterCount} filter
                      {activeFilterCount !== 1 ? "s" : ""} active
                    </Text>
                  </Box>
                )}
              </VStack>
            </Collapsible.Content>
          </Collapsible.Root>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export const SearchBar = React.memo(SearchBarComponent);
