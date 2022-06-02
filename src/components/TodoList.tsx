import { Todo } from "../models/model";
import SingleTodo from "./SingleTodo";
import { Droppable } from "react-beautiful-dnd";
interface Props {
  todos: Todo[];
  dispatch: React.DispatchWithoutAction;
  dispatch2: React.DispatchWithoutAction;
  completedTodos: Todo[];
  dispatch3: React.DispatchWithoutAction;
  inProgress: Todo[];
}

const TodoList: React.FC<Props> = ({
  todos,
  dispatch,
  completedTodos,
  dispatch2,
  dispatch3,
  inProgress
}) => {
  return (
    <div className="container">
      <Droppable droppableId="TodosList">
        {(provided, snapshot) => (
          <div
            className={`todos ${snapshot.isDraggingOver ? "dragactive" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos__heading">Active Tasks</span>
            {todos?.map((todo, index) => (
              <SingleTodo
                todo={todo}
                index={index}
                todos={todos}
                key={todo.id}
                dispatch={dispatch}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="InProgress">
        {(provided, snapshot) => (
          <div
            className={`todos ${
              snapshot.isDraggingOver ? "dragprocess" : "progress"
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos__heading">In Progress</span>
            {inProgress?.map((todo, index) => (
              <SingleTodo
                todo={todo}
                index={index}
                todos={inProgress}
                key={todo.id}
                dispatch={dispatch3}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="CompletedList">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`todos  ${
              snapshot.isDraggingOver ? "dragcomplete" : "remove"
            }`}
          >
            <span className="todos__heading">Completed Tasks</span>
            {completedTodos?.map((todo, index) => (
              <SingleTodo
                todo={todo}
                index={index}
                key={todo.id}
                todos={completedTodos}
                dispatch={dispatch2}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
export default TodoList;
