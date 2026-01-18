/**
 * Todo item interface matching the JSONPlaceholder API
 */
export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

/**
 * Extended Todo with local state for tracking changes
 */
export interface TodoWithState extends Todo {
    /** Original completed value from the server */
    originalCompleted: boolean;
    /** Whether this row is selected */
    isSelected: boolean;
    /** Whether this todo has unsaved changes */
    isDirty: boolean;
    /** Whether this todo is currently being saved */
    isSaving: boolean;
    /** Error message if save failed */
    saveError: string | null;
}

/**
 * Payload for updating a todo
 */
export interface TodoUpdatePayload {
    completed: boolean;
}

/**
 * Result of a save operation
 */
export interface SaveResult {
    id: number;
    success: boolean;
    error?: string;
}
