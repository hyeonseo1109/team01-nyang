import { useState } from 'react';
import TodoList from './TodoList';
import { 
  useTodos, 
  useCreateTodo, 
  useUpdateTodo, 
  useDeleteTodo, 
  useToggleTodoComplete 
} from '../../api/todos';

export default function Todo({ setOpenTodo }) {
  const [form, setForm] = useState({ title: '', memo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { todoData, todoIsLoading, todoIsError } = useTodos();
  const { createTodoMutate } = useCreateTodo();
  const { updateTodoMutate } = useUpdateTodo();
  const { deleteTodoMutate } = useDeleteTodo();
  const { toggleTodoCompleteMutate } = useToggleTodoComplete();

  const list = todoData?.todos || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) return;

    if (isEditing && editingId !== null) {
      updateTodoMutate(
        {
          id: editingId,
          payload: {
            content: form.title,
          }
        },
        {
          onSuccess: () => {
            setForm({ title: '', memo: '' });
            setIsEditing(false);
            setEditingId(null);
          }
        }
      );
    } else {
      createTodoMutate(form, {
        onSuccess: () => {
          setForm({ title: '', memo: '' });
        }
      });
    }
  };

  const handleDelete = (id) => {
    deleteTodoMutate(id, {
      onSuccess: () => {
        if (editingId === id) {
          setIsEditing(false);
          setEditingId(null);
          setForm({ title: '', memo: '' });
        }
      }
    });
  };

  const handleToggle = (id) => {
    const todo = list.find(item => item.id === id);
    if (!todo) return;

    updateTodoMutate({
      id,
      payload: {
        is_completed: !todo.is_completed
      }
    });
  };

  const handleEdit = (item) => {
    setForm({ 
      title: item.content || item.title, 
      memo: item.memo || '' 
    });
    setIsEditing(true);
    setEditingId(item.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({ title: '', memo: '' });
  };

  if (todoIsLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (todoIsError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <TodoList
        form={form}
        onChange={handleChange}
        onAdd={handleAdd}
        onCancelEdit={handleCancelEdit}
        isEditing={isEditing}
        list={list.map(item => ({
          ...item,
          title: item.content || item.title,
          completed: item.is_completed || item.completed
        }))}
        handleDelete={handleDelete}
        onToggle={handleToggle}
        onEdit={handleEdit}
        setOpenTodo={setOpenTodo}
      />
    </div>
  );
}