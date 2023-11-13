import type { NextPage } from 'next';
import Head from 'next/head';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import ToDoItems from '../components/ToDoItems';
import Events from '../components/Events';
import Contacts from '../components/Contacts';
import { useState } from 'react';

// Customize the Chakra UI theme
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'teal.50', // Background color
        color: 'gray.800',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
  fonts: {
    body: 'Roboto, sans-serif',
    heading: 'Montserrat, sans-serif',
  },
  colors: {
    brand: {
      50: '#008080', // Teal
      100: '#FFA500', // Orange
    },
  },
});

const Home: NextPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <ChakraProvider theme={theme}>
      <div>
        <Head>
          <title>Task Tracker</title>
          <meta name="description" content="Task Tracker is your all-in-one solution for managing todos, events, and contacts efficiently. Seamlessly organize your daily tasks, set priorities, and keep track of completed items with the intuitive Todo feature. Plan and coordinate your upcoming events effortlessly, ensuring you never miss an important date. Stay connected with your network by managing contacts, complete with detailed information and easy access. Task Tracker streamlines your workflow, providing a unified platform to enhance your productivity across todos, events, and contacts, all in one place. Elevate your task management experience with Task Tracker." />
          <link rel="icon" href="public/favicon.ico" />
        </Head>

        {/* Header */}
        <Box bg="brand.50" p={4}>
          <Container maxW="container.lg">
            <Flex justify="space-between" align="center">
              <Image src="/pen.png" alt="Logo" boxSize="50px" />
              <Heading as="h1" size="lg" color="brand.100"> {/* Adjusted text color */}
                Task Tracker
              </Heading>
              <Link href="/__repl" target="_blank" rel="noopener noreferrer" color="brand.100"> {/* Adjusted link color */}
                Built on
                <Image src="/replit.svg" alt="Replit Logo" boxSize="20px" />
                Replit
              </Link>
            </Flex>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="container.lg" mt={4}>
          <VStack spacing={8} align="center">
            {/* Filter Buttons */}
            <Flex>
              <Button mx={2} onClick={() => setSelectedCategory('ToDo')} colorScheme="teal"> {/* Adjusted button color */}
                ToDo
              </Button>
              <Button mx={2} onClick={() => setSelectedCategory('Events')} colorScheme="orange"> {/* Adjusted button color */}
                Events
              </Button>
              <Button mx={2} onClick={() => setSelectedCategory('Contacts')} colorScheme="teal"> {/* Adjusted button color */}
                Contacts
              </Button>
            </Flex>

            {/* Show respective component based on selected category */}
            {selectedCategory === 'ToDo' && <ToDoItems />}
            {selectedCategory === 'Events' && <Events />}
            {selectedCategory === 'Contacts' && <Contacts />}
          </VStack>
        </Container>

        {/* Footer */}
        <Box bg="brand.50" p={4} mt={4}>
          <Container maxW="container.lg">
            <Text textAlign="center" color="brand.100"> {/* Adjusted text color */}
              © {new Date().getFullYear()} Your App. All rights reserved.
            </Text>
          </Container>
        </Box>
      </div>
    </ChakraProvider>
  );
};

export default Home;
