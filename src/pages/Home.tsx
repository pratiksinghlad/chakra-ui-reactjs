import {
    Box,
    Container,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    VStack,
    useToast,
    useColorModeValue,
} from '@chakra-ui/react';
import { useTodos } from '../hooks/useTodos';
import { ActionBar } from '../components/ActionBar';
import { TodosTable } from '../components/TodosTable';

/**
 * Home page component displaying the todos table
 */
export function Home() {
    const {
        todos,
        isLoading,
        error,
        isSaving,
        dirtyCount,
        toggleCompleted,
        saveChanges,
        clearChanges,
        refetch,
        page,
        pageSize,
        totalCount,
        sortField,
        sortOrder,
        setPage,
        setPageSize,
        toggleSort,
    } = useTodos();

    const toast = useToast();
    const bgGradient = useColorModeValue(
        'linear(to-b, gray.50, white)',
        'linear(to-b, gray.900, gray.800)'
    );

    const handleSave = async () => {
        const results = await saveChanges();

        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.filter((r) => !r.success).length;

        if (successCount > 0 && failureCount === 0) {
            toast({
                title: 'Changes saved',
                description: `Successfully updated ${successCount} todo(s).`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        } else if (failureCount > 0 && successCount > 0) {
            toast({
                title: 'Partial success',
                description: `${successCount} saved, ${failureCount} failed. Check error badges.`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        } else if (failureCount > 0) {
            toast({
                title: 'Save failed',
                description: `Failed to save ${failureCount} todo(s). Please try again.`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const handleClear = () => {
        clearChanges();
        toast({
            title: 'Changes discarded',
            description: 'All local changes have been reset.',
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: 'top-right',
        });
    };

    return (
        <Box minH="100vh" bgGradient={bgGradient}>
            <Container maxW="container.xl" py={8}>
                {/* Header */}
                <Box mb={8}>
                    <Heading
                        as="h1"
                        size="xl"
                        bgGradient="linear(to-r, brand.500, purple.500)"
                        bgClip="text"
                        mb={2}
                    >
                        Todo Manager
                    </Heading>
                    <Text color="gray.600" fontSize="lg">
                        Select, edit, and save your todos with ease
                    </Text>
                </Box>

                {/* Error State */}
                {error && !isLoading && (
                    <Alert
                        status="error"
                        variant="subtle"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        borderRadius="lg"
                        py={8}
                        mb={8}
                        role="alert"
                    >
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            Failed to load todos
                        </AlertTitle>
                        <AlertDescription maxWidth="sm" mb={4}>
                            {error}
                        </AlertDescription>
                        <Button colorScheme="red" variant="outline" onClick={refetch}>
                            Try Again
                        </Button>
                    </Alert>
                )}

                {/* Main Content */}
                <Box position="relative">
                    {/* Centered Loading Overlay for initial load */}
                    {isLoading && todos.length === 0 && (
                        <VStack spacing={4} py={16} role="status" aria-label="Loading todos">
                            <Spinner
                                size="xl"
                                thickness="4px"
                                speed="0.65s"
                                color="brand.500"
                                emptyColor="gray.200"
                            />
                            <Text color="gray.500" fontSize="lg">
                                Loading todos...
                            </Text>
                        </VStack>
                    )}

                    {(todos.length > 0 || isLoading) && (
                        <>
                            <ActionBar
                                dirtyCount={dirtyCount}
                                isSaving={isSaving}
                                onSave={handleSave}
                                onClear={handleClear}
                            />

                            <TodosTable
                                todos={todos}
                                currentPage={page}
                                pageSize={pageSize}
                                totalCount={totalCount}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                                onToggleCompleted={toggleCompleted}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={toggleSort}
                                isLoading={isLoading}
                            />
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
