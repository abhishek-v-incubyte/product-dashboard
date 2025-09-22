import React, { useState, useEffect, useMemo } from "react";
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
} from "@chakra-ui/react";
import { HiSearch, HiX, HiFilter } from "react-icons/hi";
import type { SearchFilters } from "~/types/product";

interface SearchBarProps {
  filters: SearchFilters;
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  categories: string[];
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onSearch,
  onReset,
  categories,
  isLoading = false,
}) => {
  const [localQuery, setLocalQuery] = useState(filters.query || "");

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localQuery !== filters.query) {
        onSearch({ ...filters, query: localQuery });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, filters, onSearch]);

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
    <Card.Root>
      <Card.Body>
        <VStack gap={4} align="stretch">
          {/* Main Search Row */}
          <HStack gap={3}>
            <InputGroup flex="1" startElement={<HiSearch color="gray.400" />}>
              <Input
                placeholder="Search products..."
                value={localQuery}
                onChange={handleInputChange}
                disabled={isLoading}
                role="searchbox"
                aria-label="Search products"
              />
            </InputGroup>

            {categories.length > 0 && (
              <Field.Root>
                <Field.Label srOnly>Category</Field.Label>
                <NativeSelect.Root width="150px">
                  <NativeSelect.Field
                    value={filters.category || "All"}
                    onChange={handleCategoryChange}
                    aria-label="Category"
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

            <Button variant="ghost" colorPalette="red" onClick={onReset}>
              Clear Filters
            </Button>
          </HStack>

          {/* Price Range */}
          <HStack gap={3}>
            <Input
              type="number"
              placeholder="Min price"
              value={filters.minPrice || ""}
              onChange={handleMinPriceChange}
              size="sm"
              width="120px"
            />
            <Input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice || ""}
              onChange={handleMaxPriceChange}
              size="sm"
              width="120px"
            />

            {/* Stock Status */}
            <Field.Root>
              <Field.Label srOnly>Stock Status</Field.Label>
              <NativeSelect.Root size="sm" width="130px">
                <NativeSelect.Field
                  value={
                    filters.inStock === undefined
                      ? ""
                      : filters.inStock.toString()
                  }
                  onChange={handleStockChange}
                  aria-label="Stock Status"
                >
                  <option value="">All Stock</option>
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

            {/* Minimum Rating */}
            <Field.Root>
              <Field.Label srOnly>Minimum Rating</Field.Label>
              <NativeSelect.Root size="sm" width="130px">
                <NativeSelect.Field
                  value={filters.minRating || ""}
                  onChange={handleRatingChange}
                  aria-label="Minimum Rating"
                >
                  <option value="">Any Rating</option>
                  <option value="1">1+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </HStack>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <Box>
              <Text fontSize="sm" color="fg.muted">
                {activeFilterCount}{" "}
                {activeFilterCount === 1 ? "filter" : "filters"} applied
              </Text>
            </Box>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
