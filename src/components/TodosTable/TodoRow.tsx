import { memo } from 'react';
import {
    Tr,
    Td,
    Checkbox,
    Text,
    Badge,
    HStack,
    Spinner,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import type { TodoWithState } from '../../types/todo';

interface TodoRowProps {
    todo: TodoWithState;
    onToggleCompleted: (id: number) => void;
}

/**
 * Single row component for a todo item
 */
function TodoRowComponent({
    todo,
    onToggleCompleted,
}: TodoRowProps) {
    const dirtyBgColor = useColorModeValue('yellow.50', 'yellow.900');
    const errorBgColor = useColorModeValue('red.50', 'red.900');
    const selectedBgColor = useColorModeValue('blue.50', 'blue.900');
    const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

    const getBgColor = () => {
        if (todo.saveError) return errorBgColor;
        if (todo.isDirty) return dirtyBgColor;
        if (todo.isSelected) return selectedBgColor;
        return undefined;
    };



    const handleCompletedChange = () => {
        onToggleCompleted(todo.id);
    };

    return (
        <Tr
            bg={getBgColor()}
            _hover={{ bg: hoverBgColor }}
            transition="background-color 0.2s"
            role="row"
            aria-selected={todo.isSelected}
        >
            <Td width="120px">
                <HStack spacing={2}>
                    {todo.isSaving ? (
                        <Spinner size="sm" color="brand.500" />
                    ) : (
                        <Checkbox
                            isChecked={todo.completed}
                            onChange={handleCompletedChange}
                            aria-label={`Mark todo ${todo.id} as ${todo.completed ? 'incomplete' : 'complete'}`}
                            colorScheme={todo.completed ? 'green' : 'gray'}
                            isDisabled={todo.completed || todo.isSaving}
                        >
                            <Text fontSize="sm">{todo.completed ? 'Done' : 'Pending'}</Text>
                        </Checkbox>
                    )}
                </HStack>
            </Td>
            <Td width="80px" isNumeric>
                <Text fontWeight="medium" fontSize="sm" color="gray.500">
                    #{todo.id}
                </Text>
            </Td>
            <Td>
                <HStack spacing={2}>
                    <Text
                        fontSize="sm"
                        color={todo.completed ? 'gray.500' : 'inherit'}
                        noOfLines={2}
                    >
                        {todo.title}
                    </Text>
                    {todo.isDirty && (
                        <Badge colorScheme="orange" fontSize="xs" variant="subtle">
                            Modified
                        </Badge>
                    )}
                    {todo.saveError && (
                        <Tooltip label={todo.saveError} hasArrow>
                            <Badge colorScheme="red" fontSize="xs" variant="solid">
                                Error
                            </Badge>
                        </Tooltip>
                    )}
                </HStack>
            </Td>
            <Td width="80px">
                <Badge
                    colorScheme={todo.completed ? 'green' : 'gray'}
                    variant="subtle"
                    fontSize="xs"
                >
                    User {todo.userId}
                </Badge>
            </Td>
        </Tr>
    );
}

// Memoize to prevent unnecessary re-renders
export const TodoRow = memo(TodoRowComponent);
