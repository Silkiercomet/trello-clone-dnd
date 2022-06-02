import "./styles.css";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import { useState, useReducer, useEffect } from "react";
import { Todo } from "./models/model";
import useLocalStorage from "./hooks/useLocalStorage";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
interface Edit {
  id?: number;
  todo?: string;
}

type Actions =
  | { type: "add"; payload: string }
  | { type: "remove"; payload: number }
  | { type: "done"; payload: number }
  | { type: "all"; payload: Todo[] }
  | { type: "edit"; payload: Edit };

const reducerFunction = (state: Todo[], actions: Actions): Todo[] => {
  switch (actions.type) {
    case "add":
      return [
        ...state,
        { id: Date.now(), todo: actions.payload, isDone: false }
      ];

    case "edit":
      return state.map((todo) =>
        todo.id === actions.payload.id
          ? { ...todo, todo: actions.payload.todo }
          : todo
      );

    case "remove":
      return state.filter((todo) => todo.id !== actions.payload);

    case "done":
      return state.map((todo) =>
        todo.id === actions.payload ? { ...todo, isDone: !todo.isDone } : todo
      );

    case "all":
      return (state = actions.payload);

    default:
      return state;
  }
};

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, dispatch] = useReducer<
    (arg1: Todo[], actions: Actions) => Todo[]
  >(reducerFunction, []);
  const [completedTodos, dispatch2] = useReducer<
    (arg1: Todo[], actions: Actions) => Todo[]
  >(reducerFunction, []);
  const [inProgress, dispatch3] = useReducer(reducerFunction, []);
  const [isActive, setActive] = useLocalStorage("active", []);
  const [isProcess, setProcess] = useLocalStorage("process", []);
  const [isDone, setDone] = useLocalStorage("done", []);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo) {
      dispatch({ type: "add", payload: todo });
      setTodo("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    let active = todos;
    let complete = completedTodos;
    let quedTask = inProgress;
    // Source Logic
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else if (source.droppableId === "CompletedList") {
      add = complete[source.index];
      complete.splice(source.index, 1);
    } else if (source.droppableId === "InProgress") {
      add = quedTask[source.index];
      quedTask.splice(source.index, 1);
    }

    // Destination Logic
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
    } else if (destination.droppableId === "CompletedList") {
      complete.splice(destination.index, 0, add);
    } else if (destination.droppableId === "InProgress") {
      quedTask.splice(destination.index, 0, add);
    }
    dispatch({ type: "all", payload: active });
    dispatch2({ type: "all", payload: complete });
    dispatch3({ type: "all", payload: quedTask });
  };
  useEffect(() => {
    setTimeout(() => {
      setActive(todos);
      setProcess(inProgress);
      setDone(completedTodos);
    }, 100);
  });

  useEffect(() => {
    dispatch({ type: "all", payload: isActive });
    dispatch2({ type: "all", payload: isDone });
    dispatch3({ type: "all", payload: isProcess });
  }, []);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <nav className="navbar">
          <h1 className="heading">tasker</h1>
        </nav>
        <InputField todo={todo} setTodo={setTodo} onSubmit={onSubmit} />
        <TodoList
          todos={todos}
          inProgress={inProgress}
          completedTodos={completedTodos}
          dispatch={dispatch}
          dispatch2={dispatch2}
          dispatch3={dispatch3}
        />
      </div>
    </DragDropContext>
  );
};
export default App;

/*
  // primitive data types
  let name : string;
  let age : number | string;
  let isStudent : boolean;
  let hobbies : string[];
  let roleAndYears : [number, string];

  //objects
  type Person = {
    name:string,
    age:number,
    optional?: boolean
  }

  let luis : Person;
  let lotsOfPeople : Person[]

  type X = {
    game:string,
    hours:number
  }
  type Y = X & {
    played:number,
    AFK:number
  }

  interface Face {
    nose:string;
    mouth:boolean
  }

  interface Head extends Face{
    brain:boolean,
    eyebrowns:string
  }

  //funtions
  let printName : (name: string) => never //unknown | any | void/empty
  */
