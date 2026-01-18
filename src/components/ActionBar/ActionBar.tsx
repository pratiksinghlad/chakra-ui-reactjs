import {
    Box,
    Flex,
    Button,
    Text,
    Badge,
    HStack,
    useColorModeValue,
    Spinner,
} from '@chakra-ui/react';

interface ActionBarProps {
    dirtyCount: number;
    isSaving: boolean;
    onSave: () => void;
    onClear: () => void;
}

/**
 * Action bar component showing selection count and save/clear buttons
 */
export function ActionBar({
    dirtyCount,
    isSaving,
    onSave,
    onClear,
}: ActionBarProps) {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hasChanges = dirtyCount > 0;
    const showBar = hasChanges;

    if (!showBar) {
        return null;
    }

    return (
        <Box
            bg={bgColor}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            p={4}
            mb={4}
            shadow="sm"
            role="toolbar"
            aria-label="Table actions"
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align={{ base: 'stretch', md: 'center' }}
                gap={4}
            >
                <HStack spacing={4} wrap="wrap">

                    {hasChanges && (
                        <HStack>
                            <Text fontSize="sm" fontWeight="medium">
                                Unsaved:
                            </Text>
                            <Badge colorScheme="orange" fontSize="sm" px={2} py={1} borderRadius="md">
                                {dirtyCount}
                            </Badge>
                        </HStack>
                    )}
                </HStack>

                <HStack spacing={3}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClear}
                        isDisabled={isSaving}
                        aria-label="Clear selection and discard changes"
                    >
                        Clear
                    </Button>
                    <Button
                        colorScheme="brand"
                        size="sm"
                        onClick={onSave}
                        isDisabled={!hasChanges || isSaving}
                        aria-label={`Save ${dirtyCount} unsaved changes`}
                        leftIcon={isSaving ? <Spinner size="xs" /> : undefined}
                    >
                        {isSaving ? 'Saving...' : `Save ${hasChanges ? `(${dirtyCount})` : ''}`}
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
}
