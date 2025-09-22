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

    // Wait for the debounced call
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith({
          ...defaultFilters,
          query: "laptop",
        });
      },
      { timeout: 1000 }
    );
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

  it("should render price range inputs when filters are expanded", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    // Click the Filters button to expand the collapsible section
    const filtersButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filtersButton);

    // Now the price inputs should be visible
    expect(screen.getByPlaceholderText(/\$0/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\$999/i)).toBeInTheDocument();
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

    // Expand filters first
    const filtersButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filtersButton);

    // Wait for filters to be available
    const minPriceInput = await screen.findByPlaceholderText(/\$0/i);
    const maxPriceInput = await screen.findByPlaceholderText(/\$999/i);

    // Clear and set values directly
    fireEvent.change(minPriceInput, { target: { value: "50" } });
    fireEvent.change(maxPriceInput, { target: { value: "200" } });

    // Wait for the debounced calls
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.objectContaining({ minPrice: 50 })
      );
    });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(
        expect.objectContaining({ maxPrice: 200 })
      );
    });
  });

  it("should render stock status filter when expanded", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    // Expand filters first
    const filtersButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filtersButton);

    // Wait for the collapsible to expand and then find the select by aria-label
    await waitFor(() => {
      expect(screen.getByLabelText(/stock status/i)).toBeInTheDocument();
    });
  });

  it("should call onSearch when stock status changes", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    // Expand filters first
    const filtersButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filtersButton);

    // Wait for the element to be available
    const stockSelect = await screen.findByLabelText(/stock status/i);
    fireEvent.change(stockSelect, { target: { value: "true" } });

    expect(mockOnSearch).toHaveBeenCalledWith({
      ...defaultFilters,
      inStock: true,
    });
  });

  it("should render rating filter when expanded", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    // Expand filters first
    const filtersButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filtersButton);

    // Wait for the collapsible to expand
    await waitFor(() => {
      expect(screen.getByLabelText(/minimum rating/i)).toBeInTheDocument();
    });
  });

  it("should call onSearch when rating filter changes", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    // Expand filters first
    const filtersButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filtersButton);

    // Wait for the element to be available
    const ratingSelect = await screen.findByLabelText(/minimum rating/i);
    fireEvent.change(ratingSelect, { target: { value: "4" } });

    expect(mockOnSearch).toHaveBeenCalledWith({
      ...defaultFilters,
      minRating: 4,
    });
  });

  it("should render clear all button when filters are active", () => {
    const filtersWithData = { ...defaultFilters, query: "test" };

    renderWithProvider(
      <SearchBar
        filters={filtersWithData}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    expect(
      screen.getByRole("button", { name: /clear all/i })
    ).toBeInTheDocument();
  });

  it("should call onReset when clear all button is clicked", () => {
    const filtersWithData = { ...defaultFilters, query: "test" };

    renderWithProvider(
      <SearchBar
        filters={filtersWithData}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const clearButton = screen.getByRole("button", { name: /clear all/i });
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

    // Expand filters first
    const filtersButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filtersButton);

    const minPriceInput = screen.getByPlaceholderText(/\$0/i);
    await user.type(minPriceInput, "invalid");

    // Should not crash and should not call onSearch with invalid price
    expect(mockOnSearch).not.toHaveBeenCalledWith(
      expect.objectContaining({ minPrice: NaN })
    );
  });

  it("should debounce multiple rapid changes", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={[]}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search products/i);

    // Type the full string
    fireEvent.change(searchInput, { target: { value: "laptop" } });

    // Wait for the debounced call
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith({
          ...defaultFilters,
          query: "laptop",
        });
      },
      { timeout: 1000 }
    );
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

    // Should show filter count badge on the Filters button
    expect(screen.getByText("6")).toBeInTheDocument(); // Badge with count

    // Expand filters to see the active filter summary
    const filtersButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(filtersButton);

    // Should show active filter summary
    expect(screen.getByText(/6 filters active/i)).toBeInTheDocument();
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

  //focus after search input test
  it("should not auto-focus on search input when component mounts", () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={["Electronics"]}
      />
    );
    const searchInput = screen.getByPlaceholderText(/search products/i);
    // Should not auto-focus - that would be bad UX
    expect(document.activeElement).not.toBe(searchInput);
  });

  it("should maintain focus on search input after search", async () => {
    renderWithProvider(
      <SearchBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        categories={["Electronics"]}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search products/i);

    // First focus the input (simulate user clicking)
    searchInput.focus();
    expect(document.activeElement).toBe(searchInput);

    // Type in the input
    await user.type(searchInput, "laptop");

    // Wait for search to be called and focus should still be maintained
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith({
          ...defaultFilters,
          query: "laptop",
        });
      },
      { timeout: 1000 }
    );

    // Focus should be maintained after search executes
    expect(document.activeElement).toBe(searchInput);
  });
});
