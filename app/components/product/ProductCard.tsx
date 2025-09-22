import React from "react";
import {
  Box,
  Button,
  Card,
  Text,
  Image,
  Badge,
  Stack,
  Flex,
  HStack,
  VStack,
  Group,
  IconButton,
} from "@chakra-ui/react";
import { HiStar, HiShoppingCart, HiMinus, HiPlus } from "react-icons/hi";
import { useCart } from "~/context/CartContext";
import type { Product } from "~/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    getItemQuantity,
    isInCart,
  } = useCart();

  const itemQuantity = getItemQuantity(product.id);
  const isProductInCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    onAddToCart?.(product, 1);
  };

  const handleIncreaseQuantity = () => {
    addToCart(product, 1);
  };

  const handleDecreaseQuantity = () => {
    if (itemQuantity > 1) {
      updateQuantity(product.id, itemQuantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card.Root
      maxW="320px"
      overflow="hidden"
      cursor="pointer"
      data-testid="product-card"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "lg",
        transition: "all 0.3s ease",
      }}
      transition="all 0.3s ease"
    >
      <Box position="relative">
        <Image
          src={product.image || "/placeholder-image.jpg"}
          alt={product.name}
          h="200px"
          w="full"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top="2"
          right="2"
          colorPalette={product.inStock ? "green" : "red"}
          variant="solid"
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </Badge>
      </Box>

      <Card.Body>
        <VStack align="stretch" gap="3">
          {/* Product Category */}
          <Badge
            alignSelf="flex-start"
            size="xs"
            variant="outline"
            colorPalette="gray"
          >
            {product.category}
          </Badge>

          {/* Product Name */}
          <Card.Title fontSize="lg" fontWeight="semibold" lineHeight="1.3">
            {product.name}
          </Card.Title>

          {/* Product Description */}
          <Text
            fontSize="sm"
            color="fg.muted"
            lineHeight="1.5"
            title={product.description}
          >
            {truncateText(product.description)}
          </Text>

          {/* Rating */}
          <Flex align="center" gap="2">
            <Flex align="center" gap="1">
              <HiStar color="orange" size="16px" />
              <Text fontSize="sm" fontWeight="medium">
                {product.rating}
              </Text>
            </Flex>
            <Text fontSize="sm" color="fg.muted">
              ({product.reviewCount} reviews)
            </Text>
          </Flex>

          {/* Tags */}
          <Group gap="1" wrap="wrap">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} size="xs" variant="subtle" colorPalette="blue">
                {tag}
              </Badge>
            ))}
          </Group>
        </VStack>
      </Card.Body>

      <Card.Footer justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="bold" color="brand.600">
          {formatPrice(product.price)}
        </Text>

        {!isProductInCart ? (
          <Button
            size="sm"
            colorPalette="brand"
            variant="solid"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <HiShoppingCart />
            Add to Cart
          </Button>
        ) : (
          <HStack gap="2">
            <IconButton
              size="sm"
              variant="outline"
              onClick={handleDecreaseQuantity}
              aria-label="Decrease quantity"
            >
              <HiMinus />
            </IconButton>
            <Text fontSize="sm" fontWeight="medium" minW="6" textAlign="center">
              {itemQuantity}
            </Text>
            <IconButton
              size="sm"
              variant="outline"
              onClick={handleIncreaseQuantity}
              aria-label="Increase quantity"
            >
              <HiPlus />
            </IconButton>
          </HStack>
        )}
      </Card.Footer>
    </Card.Root>
  );
};
