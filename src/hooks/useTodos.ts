import { useState, useCallback, useEffect } from 'react';
import type { Todo, TodoWithState, SaveResult } from '../types/todo';
import { TodoService } from '../api/todos';

interface UseTodosState {
    todos: TodoWithState[];
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;
    page: number;
    pageSize: number;
    totalCount: number;
    sortField: string | null;
    sortOrder: 'asc' | 'desc';
}

interface UseTodosReturn extends UseTodosState {
    /** Number of selected rows */
    selectedCount: number;
    /** Number of rows with unsaved changes */
    dirtyCount: number;
    /** Toggle selection for a single row */
    toggleSelection: (id: number) => void;
    /** Toggle select all rows */
    toggleSelectAll: () => void;
    /** Check if all rows are selected */
    isAllSelected: boolean;
    /** Check if some (but not all) rows are selected */
    isIndeterminate: boolean;
    /** Toggle the completed status of a todo */
    toggleCompleted: (id: number) => void;
    /** Save all dirty todos to the API */
    saveChanges: () => Promise<SaveResult[]>;
    /** Discard all local changes and clear selection */
    clearChanges: () => void;
    /** Refetch todos from the API */
    refetch: () => Promise<void>;
    /** Change current page */
    setPage: (page: number) => void;
    /** Change items per page */
    setPageSize: (pageSize: number) => void;
    /** Toggle sorting on a field */
    toggleSort: (field: string) => void;
}

/**
 * Transform a raw Todo into a TodoWithState
 */
function createTodoWithState(todo: Todo): TodoWithState {
    return {
        ...todo,
        originalCompleted: todo.completed,
        isSelected: false,
        isDirty: false,
        isSaving: false,
        saveError: null,
    };
}

/**
 * Custom hook for managing todos with selection and dirty tracking
 */
export function useTodos(): UseTodosReturn {
    const [state, setState] = useState<UseTodosState>({
        todos: [],
        isLoading: true,
        error: null,
        isSaving: false,
        page: 1,
        pageSize: 25,
        totalCount: 0,
        sortField: null,
        sortOrder: 'asc',
    });

    const loadTodos = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const { data: rawTodos, total } = await TodoService.fetchTodosPaginated(
                state.page,
                state.pageSize,
                state.sortField || undefined,
                state.sortOrder
            );
            const todosWithState = rawTodos.map(createTodoWithState);
            setState((prev) => ({
                ...prev,
                todos: todosWithState,
                totalCount: total,
                isLoading: false,
                error: null,
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todos';
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
        }
    }, [state.page, state.pageSize, state.sortField, state.sortOrder]);

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    const toggleSelection = useCallback((id: number) => {
        setState((prev) => ({
            ...prev,
            todos: prev.todos.map((todo) =>
                todo.id === id ? { ...todo, isSelected: !todo.isSelected } : todo
            ),
        }));
    }, []);

    const toggleSelectAll = useCallback(() => {
        setState((prev) => {
            const allSelected = prev.todos.every((todo) => todo.isSelected);
            return {
                ...prev,
                todos: prev.todos.map((todo) => ({
                    ...todo,
                    isSelected: !allSelected,
                })),
            };
        });
    }, []);

    const toggleCompleted = useCallback((id: number) => {
        setState((prev) => ({
            ...prev,
            todos: prev.todos.map((todo) => {
                if (todo.id !== id) return todo;
                // Once done, it cannot be changed back
                if (todo.completed) return todo;

                const newCompleted = !todo.completed;
                const isDirty = newCompleted !== todo.originalCompleted;
                return {
                    ...todo,
                    completed: newCompleted,
                    isDirty,
                    saveError: null,
                };
            }),
        }));
    }, []);

    const saveChanges = useCallback(async (): Promise<SaveResult[]> => {
        const dirtyTodos = state.todos.filter((todo) => todo.isDirty);
        if (dirtyTodos.length === 0) return [];

        setState((prev) => ({
            ...prev,
            isSaving: true,
            todos: prev.todos.map((todo) =>
                todo.isDirty ? { ...todo, isSaving: true, saveError: null } : todo
            ),
        }));

        const updates = dirtyTodos.map((todo) => ({
            id: todo.id,
            payload: { completed: todo.completed },
        }));

        const results = await TodoService.batchUpdateTodos(updates);

        setState((prev) => ({
            ...prev,
            isSaving: false,
            todos: prev.todos.map((todo) => {
                const result = results.find((r) => r.id === todo.id);
                if (!result) return todo;

                if (result.success) {
                    return {
                        ...todo,
                        originalCompleted: todo.completed,
                        isDirty: false,
                        isSaving: false,
                        saveError: null,
                    };
                }
                return {
                    ...todo,
                    isSaving: false,
                    saveError: result.error || 'Save failed',
                };
            }),
        }));

        return results.map((r) => ({
            id: r.id,
            success: r.success,
            error: r.error,
        }));
    }, [state.todos]);

    const clearChanges = useCallback(() => {
        setState((prev) => ({
            ...prev,
            todos: prev.todos.map((todo) => ({
                ...todo,
                completed: todo.originalCompleted,
                isSelected: false,
                isDirty: false,
                saveError: null,
            })),
        }));
    }, []);

    const refetch = useCallback(async () => {
        await loadTodos();
    }, [loadTodos]);

    const setPage = useCallback((page: number) => {
        setState((prev) => ({ ...prev, page }));
    }, []);

    const setPageSize = useCallback((pageSize: number) => {
        setState((prev) => ({ ...prev, pageSize, page: 1 }));
    }, []);

    const toggleSort = useCallback((field: string) => {
        setState((prev) => {
            if (prev.sortField === field) {
                return {
                    ...prev,
                    sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
                    page: 1,
                };
            }
            return {
                ...prev,
                sortField: field,
                sortOrder: 'asc',
                page: 1,
            };
        });
    }, []);

    // Computed values
    const selectedCount = state.todos.filter((todo) => todo.isSelected).length;
    const dirtyCount = state.todos.filter((todo) => todo.isDirty).length;
    const isAllSelected = state.todos.length > 0 && state.todos.every((todo) => todo.isSelected);
    const isIndeterminate = selectedCount > 0 && !isAllSelected;

    return {
        ...state,
        selectedCount,
        dirtyCount,
        toggleSelection,
        toggleSelectAll,
        isAllSelected,
        isIndeterminate,
        toggleCompleted,
        saveChanges,
        clearChanges,
        refetch,
        setPage,
        setPageSize,
        toggleSort,
    };
}
