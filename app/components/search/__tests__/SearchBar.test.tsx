import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../SearchBar";
import type { SearchFilters } from "~/types/product";
import { Provider } from "~/components/ui/provider";

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider>{component}</Provider>);
};

describe("SearchBar", () => {
  const mockOnSearch = vi.fn();
  const mockOnReset = vi.fn();
  const user = userEvent.setup();

  const defaultFilters: SearchFilters = {
    query: "",
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
    minRating: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render search input with placeholder text", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={["Electronics", "Books"]}
      />
    );

    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
  });

  it("should display current search query value", () => {
    const filtersWithQuery = { ...defaultFilters, query: "laptop" };

    renderWithProvider(
      <SearchBar
        filters={filtersWithQuery}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    expect(screen.getByDisplayValue("laptop")).toBeInTheDocument();
  });

  it("should call onSearch with debounced query when user types", async () => {
    vi.useFakeTimers();

    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search products/i);
    await user.type(searchInput, "laptop");

    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward time to trigger debounce
    vi.advanceTimersByTime(300);

    expect(mockOnSearch).toHaveBeenCalledWith({
      ...defaultFilters,
      query: "laptop",
    });
  });

  it("should render category select when categories provided", () => {
    const categories = ["All", "Electronics", "Books", "Clothing"];

    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={categories}
      />
    );

    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();
  });

  it("should call onSearch when category is changed", async () => {
    const categories = ["All", "Electronics", "Books"];

    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={categories}
      />
    );

    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: "Electronics" } });

    expect(mockOnSearch).toHaveBeenCalledWith({
      ...defaultFilters,
      category: "Electronics",
    });
  });

  it("should render price range inputs", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();
  });

  it("should call onSearch when price filters change", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const minPriceInput = screen.getByPlaceholderText(/min price/i);
    const maxPriceInput = screen.getByPlaceholderText(/max price/i);

    await user.type(minPriceInput, "50");
    await user.type(maxPriceInput, "200");

    expect(mockOnSearch).toHaveBeenCalledWith({
      ...defaultFilters,
      minPrice: 50,
      maxPrice: 200,
    });
  });

  it("should render stock status filter", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    expect(
      screen.getByRole("combobox", { name: /stock status/i })
    ).toBeInTheDocument();
  });

  it("should call onSearch when stock status changes", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const stockSelect = screen.getByRole("combobox", { name: /stock status/i });
    fireEvent.change(stockSelect, { target: { value: "true" } });

    expect(mockOnSearch).toHaveBeenCalledWith({
      ...defaultFilters,
      inStock: true,
    });
  });

  it("should render rating filter", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    expect(
      screen.getByRole("combobox", { name: /minimum rating/i })
    ).toBeInTheDocument();
  });

  it("should call onSearch when rating filter changes", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const ratingSelect = screen.getByRole("combobox", {
      name: /minimum rating/i,
    });
    fireEvent.change(ratingSelect, { target: { value: "4" } });

    expect(mockOnSearch).toHaveBeenCalledWith({
      ...defaultFilters,
      minRating: 4,
    });
  });

  it("should render clear filters button", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    expect(
      screen.getByRole("button", { name: /clear filters/i })
    ).toBeInTheDocument();
  });

  it("should call onReset when clear filters button is clicked", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const clearButton = screen.getByRole("button", { name: /clear filters/i });
    fireEvent.click(clearButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it("should handle invalid price inputs gracefully", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const minPriceInput = screen.getByPlaceholderText(/min price/i);
    await user.type(minPriceInput, "invalid");

    // Should not crash and should not call onSearch with invalid price
    expect(mockOnSearch).not.toHaveBeenCalledWith(
      expect.objectContaining({ minPrice: NaN })
    );
  });

  it("should debounce multiple rapid changes", async () => {
    vi.useFakeTimers();

    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search products/i);

    // Type multiple characters rapidly
    await user.type(searchInput, "l");
    vi.advanceTimersByTime(100);
    await user.type(searchInput, "ap");
    vi.advanceTimersByTime(100);
    await user.type(searchInput, "top");

    // Should not have called onSearch yet
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast forward past debounce delay
    vi.advanceTimersByTime(300);

    // Should only be called once with final value
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({
      ...defaultFilters,
      query: "laptop",
    });
  });

  it("should display active filter count", () => {
    const activeFilters = {
      query: "laptop",
      category: "Electronics",
      minPrice: 100,
      maxPrice: 500,
      inStock: true,
      minRating: 4,
    };

    renderWithProvider(
      <SearchBar
        filters={activeFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={["Electronics", "Books"]}
      />
    );

    // Should show some indicator of active filters
    expect(screen.getByText(/filters applied/i)).toBeInTheDocument();
  });

  it("should be accessible with proper ARIA labels", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={["Electronics"]}
      />
    );

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByLabelText(/search products/i)).toBeInTheDocument();
  });
});
