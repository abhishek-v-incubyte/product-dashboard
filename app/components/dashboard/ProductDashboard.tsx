import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Spinner,
  Alert,
  Badge,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { ShoppingCart, RefreshCcw } from "lucide-react";
import { ProductCard } from "~/components/product/ProductCard";
import { SearchBar } from "~/components/search/SearchBar";
import { CartDrawer } from "~/components/cart/CartDrawer";
import { useCart } from "~/context/CartContext";
import { ProductService } from "~/services/productService";
import type { Product, SearchFilters } from "~/types/product";
import { categories } from "~/data/mockProducts";

export const ProductDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart, addToCart } = useCart();
  const productService = useMemo(() => new ProductService(), []);

  const loadProducts = useCallback(
    async (filters?: SearchFilters) => {
      try {
        setLoading(true);
        setError(null);

        if (
          filters?.query ||
          filters?.category ||
          filters?.minPrice ||
          filters?.maxPrice
        ) {
          const result = await productService.searchProducts(filters);
          setProducts(result.products);
        } else {
          const result = await productService.getAllProducts();
          setProducts(result.products);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    },
    [productService]
  );

  const handleSearch = useCallback(async (filters: SearchFilters) => {
    setSearchFilters(filters);
    // Don't call loadProducts here - let the useEffect handle it
  }, []);

  const handleReset = useCallback(() => {
    const resetFilters = { query: "" };
    setSearchFilters(resetFilters);
    loadProducts(resetFilters);
  }, [loadProducts]);

  const handleRetry = useCallback(() => {
    loadProducts(searchFilters);
  }, [loadProducts, searchFilters]);

  const handleAddToCart = useCallback((product: Product) => {
    // ProductCard already handles addToCart via useCart hook
    // This callback is for additional actions like analytics, notifications, etc.
    console.log(`Added ${product.name} to cart`);
  }, []);

  const handleCartOpen = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const handleCartClose = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Load products on mount and whenever searchFilters change
  useEffect(() => {
    loadProducts(searchFilters);
  }, [searchFilters, loadProducts]);

  if (loading) {
    return (
      <Box data-testid="product-dashboard" minH="100vh" bg="gray.50" py={8}>
        <Container maxW="7xl">
          <Stack gap={8} align="center" justify="center" minH="60vh">
            <Spinner data-testid="loading-spinner" size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.600">
              Loading products...
            </Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box data-testid="product-dashboard" minH="100vh" bg="gray.50" py={8}>
        <Container maxW="7xl">
          <Stack gap={6} align="center" justify="center" minH="60vh">
            <Alert.Root status="error" data-testid="error-message" maxW="md">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Error loading products</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
            <Button onClick={handleRetry} colorPalette="blue">
              <RefreshCcw size={16} />
              Retry
            </Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box data-testid="product-dashboard" minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4} mb={8}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="blue.600">
              Product Dashboard
            </Heading>
            <IconButton
              data-testid="cart-button"
              variant="outline"
              colorPalette="blue"
              position="relative"
              aria-label="View cart"
              onClick={handleCartOpen}
            >
              <ShoppingCart size={20} />
              {cart.totalItems > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  minW="20px"
                  h="20px"
                  fontSize="xs"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {cart.totalItems}
                </Badge>
              )}
            </IconButton>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl">
        <Stack gap={8} align="stretch">
          {/* Search Section */}
          <Box>
            <SearchBar
              filters={searchFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              categories={categories}
              isLoading={loading}
            />
          </Box>

          {/* Results Header */}
          <Flex justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              {products.length === 1
                ? "1 product found"
                : `${products.length} products found`}
            </Text>
          </Flex>

          {/* Products Grid */}
          {products.length === 0 ? (
            <Stack data-testid="empty-state" gap={4} py={16} align="center">
              <Text fontSize="xl" color="gray.500">
                No products found
              </Text>
              <Text color="gray.400">Try adjusting your search criteria</Text>
            </Stack>
          ) : (
            <Box
              data-testid="product-grid"
              display="grid"
              gridTemplateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
                xl: "repeat(4, 1fr)",
              }}
              gap={6}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </Box>
          )}
        </Stack>
      </Container>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={handleCartClose} />
    </Box>
  );
};
