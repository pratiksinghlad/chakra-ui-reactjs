import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Text,
    Flex,
    Select,
    HStack,
    Button,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import type { TodoWithState } from '../../types/todo';
import { TodoRow } from './TodoRow';

interface TodosTableProps {
    todos: TodoWithState[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onToggleCompleted: (id: number) => void;
    sortField: string | null;
    sortOrder: 'asc' | 'desc';
    onSort: (field: string) => void;
    isLoading?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Main table component with API-driven pagination
 */
export function TodosTable({
    todos,
    currentPage,
    pageSize,
    totalCount,
    onPageChange,
    onPageSizeChange,
    onToggleCompleted,
    sortField,
    sortOrder,
    onSort,
    isLoading = false,
}: TodosTableProps) {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const headerBgColor = useColorModeValue('gray.50', 'gray.700');

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + todos.length;

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onPageSizeChange(Number(e.target.value));
    };

    const handlePrevPage = () => {
        onPageChange(Math.max(1, currentPage - 1));
    };

    const handleNextPage = () => {
        onPageChange(Math.min(totalPages, currentPage + 1));
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    if (!isLoading && todos.length === 0) {
        return (
            <Box
                bg={bgColor}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                p={8}
                textAlign="center"
            >
                <Text color="gray.500" fontSize="lg">
                    No todos found
                </Text>
            </Box>
        );
    }

    return (
        <Box
            bg={bgColor}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            overflow="hidden"
            shadow="sm"
            opacity={isLoading ? 0.6 : 1}
            transition="opacity 0.2s"
        >
            {/* Table */}
            <Box overflowX="auto">
                <Table variant="simple" size="sm" sx={{ borderCollapse: 'collapse', 'th, td': { border: '1px solid', borderColor: borderColor } }}>
                    <Thead bg={headerBgColor}>
                        <Tr>
                            <Th
                                width="120px"
                                cursor="pointer"
                                onClick={() => onSort('completed')}
                                _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                            >
                                <HStack spacing={1}>
                                    <Text>Status</Text>
                                    {sortField === 'completed' && (
                                        sortOrder === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                                    )}
                                </HStack>
                            </Th>
                            <Th width="80px" isNumeric>
                                ID
                            </Th>
                            <Th>Title</Th>
                            <Th width="80px">User</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {todos.map((todo) => (
                            <TodoRow
                                key={todo.id}
                                todo={todo}
                                onToggleCompleted={onToggleCompleted}
                            />
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Pagination Footer */}
            <Flex
                bg={headerBgColor}
                px={4}
                py={3}
                borderTop="1px solid"
                borderColor={borderColor}
                justify="space-between"
                align="center"
                direction={{ base: 'column', md: 'row' }}
                gap={4}
            >
                <HStack spacing={4}>
                    <Text fontSize="sm" color="gray.600">
                        Showing {startIndex + 1} to {endIndex} of{' '}
                        {totalCount} todos
                    </Text>
                    <HStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                            Per page:
                        </Text>
                        <Select
                            size="sm"
                            width="70px"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            aria-label="Items per page"
                        >
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </Select>
                    </HStack>
                </HStack>

                <HStack spacing={2}>
                    <IconButton
                        aria-label="Previous page"
                        icon={<ChevronLeftIcon />}
                        size="sm"
                        variant="outline"
                        onClick={handlePrevPage}
                        isDisabled={currentPage === 1 || isLoading}
                    />
                    {getPageNumbers().map((page, index) =>
                        typeof page === 'number' ? (
                            <Button
                                key={index}
                                size="sm"
                                variant={currentPage === page ? 'solid' : 'outline'}
                                colorScheme={currentPage === page ? 'brand' : 'gray'}
                                onClick={() => handlePageClick(page)}
                                aria-label={`Go to page ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                                isDisabled={isLoading}
                            >
                                {page}
                            </Button>
                        ) : (
                            <Text key={index} color="gray.500" fontSize="sm">
                                {page}
                            </Text>
                        )
                    )}
                    <IconButton
                        aria-label="Next page"
                        icon={<ChevronRightIcon />}
                        size="sm"
                        variant="outline"
                        onClick={handleNextPage}
                        isDisabled={currentPage === totalPages || isLoading}
                    />
                </HStack>
            </Flex>
        </Box>
    );
}
