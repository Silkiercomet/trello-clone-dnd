import { Todo } from "../models/model";
import { useState, useEffect, useRef } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
const SingleTodo: React.FC<{
  todos: Todo[];
  index: number;
  todo: Todo;
  dispatch: React.DispatchWithoutAction;
}> = ({ todo, dispatch, index }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    dispatch({ type: "edit", payload: { id: id, todo: editTodo } });
    setEdit(false);
  };

  let todoText = todo.isDone ? (
    <s className="todos__single-text">{todo.todo}</s>
  ) : (
    <span className="todos__single-text">{todo.todo}</span>
  );

  let editText = edit ? (
    <input
      ref={inputRef}
      type="text"
      className="todos__single-text"
      value={editTodo}
      onChange={(e) => setEditTodo(e.target.value)}
    />
  ) : (
    todoText
  );
  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          onSubmit={(e) => handleEdit(e, todo.id)}
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
          key={todo.id}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {editText}
          <i
            className="icon"
            onClick={() => {
              if (!edit && !todo.isDone) {
                setEdit(!edit);
              }
            }}
          >
            <AiFillEdit />
          </i>
          <i
            className="icon"
            onClick={() => dispatch({ type: "remove", payload: todo.id })}
          >
            <AiFillDelete />
          </i>
          <i
            className="icon"
            onClick={() => dispatch({ type: "done", payload: todo.id })}
          >
            <MdDone />
          </i>
        </form>
      )}
    </Draggable>
  );
};
export default SingleTodo;
