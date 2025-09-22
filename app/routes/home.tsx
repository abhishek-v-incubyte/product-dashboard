import type { Route } from "./+types/home";
import { Link } from "react-router";
import {
  Box,
  Heading,
  Button,
  Text,
  Badge,
  Card,
  Stack,
  Input,
  Flex,
  Grid,
  Alert,
  Progress,
  Avatar,
  Separator,
  Tabs,
} from "@chakra-ui/react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="teal.500" size="2xl">
          🎉 Chakra UI is working!
        </Heading>
        <Link to="/dashboard">
          <Button colorPalette="blue" size="lg">
            Go to Product Dashboard
          </Button>
        </Link>
      </Flex>

      <Alert.Root status="success" mb={6}>
        <Alert.Indicator />
        <Alert.Title>
          Chakra UI has been successfully installed and configured!
        </Alert.Title>
      </Alert.Root>

      <Grid
        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap={6}
        mb={8}
      >
        <Card.Root p={6}>
          <Card.Header>
            <Heading size="lg">Buttons & Badges</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Flex gap={3} wrap="wrap">
                <Button colorScheme="teal">Primary</Button>
                <Button colorScheme="blue" variant="outline">
                  Secondary
                </Button>
                <Button colorScheme="red" variant="ghost">
                  Danger
                </Button>
              </Flex>
              <Flex gap={2} wrap="wrap">
                <Badge colorScheme="green">Success</Badge>
                <Badge colorScheme="yellow">Warning</Badge>
                <Badge colorScheme="red">Error</Badge>
                <Badge colorScheme="blue">Info</Badge>
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Card.Root p={6}>
          <Card.Header>
            <Heading size="lg">Form Elements</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Sample Input
                </Text>
                <Input placeholder="Enter some text..." />
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Large Input
                </Text>
                <Input placeholder="Large input..." size="lg" />
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Grid>

      <Card.Root p={6}>
        <Card.Header>
          <Heading size="lg">Typography & Layout</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={4}>
            <Text fontSize="lg">
              This is a large text sample showing Chakra UI's typography system.
            </Text>
            <Text fontSize="md" color="gray.600">
              This is medium gray text demonstrating color utilities.
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              This is small bold text showing font weight options.
            </Text>
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text>
                This box demonstrates background colors and border radius.
              </Text>
            </Box>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Grid
        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap={6}
        mb={8}
      >
        <Card.Root p={6}>
          <Card.Header>
            <Heading size="lg">Progress & Avatars</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Progress Bar
                </Text>
                <Progress.Root value={75} colorPalette="teal">
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              </Box>
              <Box>
                <Text mb={3} fontWeight="medium">
                  Avatars
                </Text>
                <Flex gap={3}>
                  <Avatar.Root>
                    <Avatar.Fallback name="John Doe" />
                  </Avatar.Root>
                  <Avatar.Root colorPalette="teal">
                    <Avatar.Fallback name="Jane Smith" />
                  </Avatar.Root>
                  <Avatar.Root colorPalette="purple">
                    <Avatar.Fallback name="Bob Johnson" />
                  </Avatar.Root>
                </Flex>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Card.Root p={6}>
          <Card.Header>
            <Heading size="lg">Tabs Example</Heading>
          </Card.Header>
          <Card.Body>
            <Tabs.Root defaultValue="tab-1">
              <Tabs.List>
                <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
                <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
                <Tabs.Trigger value="tab-3">Tab 3</Tabs.Trigger>
              </Tabs.List>
              <Separator my={4} />
              <Tabs.Content value="tab-1">
                <Text>
                  This is the content for Tab 1. Chakra UI tabs are very
                  flexible!
                </Text>
              </Tabs.Content>
              <Tabs.Content value="tab-2">
                <Text>
                  This is the content for Tab 2. You can put any component here.
                </Text>
              </Tabs.Content>
              <Tabs.Content value="tab-3">
                <Text>
                  This is the content for Tab 3. Perfect for organizing content.
                </Text>
              </Tabs.Content>
            </Tabs.Root>
          </Card.Body>
        </Card.Root>
      </Grid>
    </Box>
  );
}
