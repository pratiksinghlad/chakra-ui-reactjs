import { axiosClient } from './axios-client';
import type { Todo, TodoUpdatePayload } from '../types/todo';

export interface PaginatedResult<T> {
    data: T[];
    total: number;
}

export interface UpdateResult {
    id: number;
    success: boolean;
    error?: string;
    todo?: Todo;
}

/**
 * TodoService provides methods to interact with the Todo API
 */
export class TodoService {
    /**
     * Fetch paginated todos
     * @param page Page number
     * @param limit Items per page
     * @param sortField Field to sort by
     * @param sortOrder Sorting order
     */
    static async fetchTodosPaginated(
        page: number = 1,
        limit: number = 25,
        sortField?: string,
        sortOrder: 'asc' | 'desc' = 'asc'
    ): Promise<PaginatedResult<Todo>> {
        const response = await axiosClient.get<Todo[]>('/todos', {
            params: {
                _page: page,
                _limit: limit,
                _sort: sortField,
                _order: sortOrder,
            },
        });

        const total = parseInt(response.headers['x-total-count'] || '0', 10);

        return {
            data: response.data,
            total,
        };
    }

    /**
     * Update a single todo
     * @param id Todo ID
     * @param payload Fields to update
     */
    static async updateTodo(id: number, payload: TodoUpdatePayload): Promise<Todo> {
        const response = await axiosClient.patch<Todo>(`/todos/${id}`, payload);
        return response.data;
    }

    /**
     * Batch update multiple todos
     * @param updates Array of update operations
     */
    static async batchUpdateTodos(
        updates: Array<{ id: number; payload: TodoUpdatePayload }>
    ): Promise<UpdateResult[]> {
        const updatePromises = updates.map(async ({ id, payload }) => {
            try {
                const todo = await this.updateTodo(id, payload);
                return { id, success: true, todo };
            } catch (error: any) {
                return {
                    id,
                    success: false,
                    error: error.message || 'Failed to update todo',
                };
            }
        });

        return Promise.all(updatePromises);
    }
}
