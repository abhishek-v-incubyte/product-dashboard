import {
  Drawer,
  Button,
  Text,
  Stack,
  Box,
  Flex,
  IconButton,
  Image,
  Badge,
  Separator,
  Portal,
} from "@chakra-ui/react";
import { ShoppingBag, Trash2, Minus, Plus, X } from "lucide-react";
import { useCart } from "~/context/CartContext";
import type { CartItem } from "~/types/product";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <Drawer.Root
        open={isOpen}
        onOpenChange={(details) => !details.open && onClose()}
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content data-testid="cart-drawer">
            <Drawer.Header>
              <Drawer.Title>
                <Flex align="center" gap={2}>
                  <ShoppingBag size={24} />
                  <Text>Shopping Cart</Text>
                </Flex>
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <IconButton variant="ghost" size="sm" aria-label="Close cart">
                  <X size={20} />
                </IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>

            <Drawer.Body>
              {cart.items.length === 0 ? (
                <Stack data-testid="empty-cart" gap={6} align="center" py={12}>
                  <Box>
                    <ShoppingBag size={64} color="gray" />
                  </Box>
                  <Stack gap={2} textAlign="center">
                    <Text fontSize="lg" fontWeight="medium" color="gray.600">
                      Your cart is empty
                    </Text>
                    <Text color="gray.500">
                      Add some products to get started
                    </Text>
                  </Stack>
                </Stack>
              ) : (
                <Stack gap={4}>
                  {cart.items.map((item: CartItem) => (
                    <Box
                      key={item.productId}
                      data-testid={`cart-item-${item.productId}`}
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Flex gap={4} align="start">
                        <Box position="relative">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <Box
                            boxSize="60px"
                            bg="gray.200"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="absolute"
                            top="0"
                            left="0"
                            zIndex="-1"
                          >
                            <ShoppingBag size={24} color="gray" />
                          </Box>
                        </Box>

                        <Box flex="1">
                          <Text fontWeight="medium" fontSize="sm">
                            {item.product.name}
                          </Text>
                          <Text color="gray.600" fontSize="sm" mt={1}>
                            {formatPrice(item.product.price)} each
                          </Text>

                          <Flex align="center" justify="space-between" mt={3}>
                            <Flex align="center" gap={2}>
                              <IconButton
                                size="xs"
                                variant="outline"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </IconButton>

                              <Badge variant="outline" px={2} py={1}>
                                {item.quantity}
                              </Badge>

                              <IconButton
                                size="xs"
                                variant="outline"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </IconButton>
                            </Flex>

                            <IconButton
                              size="xs"
                              variant="ghost"
                              colorPalette="red"
                              onClick={() => removeFromCart(item.productId)}
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </Flex>

                          <Text
                            fontWeight="medium"
                            fontSize="sm"
                            mt={2}
                            color="blue.600"
                          >
                            Subtotal:{" "}
                            {formatPrice(item.product.price * item.quantity)}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </Stack>
              )}
            </Drawer.Body>

            <Drawer.Footer>
              <Stack gap={4} w="full">
                {cart.items.length > 0 && (
                  <>
                    <Separator />
                    <Flex justify="space-between" align="center">
                      <Text fontSize="lg" fontWeight="bold">
                        Total ({cart.totalItems} items):
                      </Text>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="blue.600"
                        data-testid="cart-total"
                      >
                        {formatPrice(cart.totalPrice)}
                      </Text>
                    </Flex>

                    <Stack gap={2}>
                      <Button
                        colorPalette="blue"
                        size="lg"
                        w="full"
                        disabled={cart.items.length === 0}
                      >
                        Proceed to Checkout
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        w="full"
                        onClick={handleClearCart}
                      >
                        Clear Cart
                      </Button>
                    </Stack>
                  </>
                )}

                {cart.items.length === 0 && (
                  <Text
                    data-testid="cart-total"
                    textAlign="center"
                    color="gray.500"
                    fontSize="lg"
                  >
                    $0.00
                  </Text>
                )}
              </Stack>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Portal>
  );
};
