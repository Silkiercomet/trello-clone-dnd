import { useRef } from "react";
import "./styles.css";

interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent) => void;
}

const InputField: React.FC<Props> = ({ todo, setTodo, onSubmit }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form
      className="input"
      onSubmit={(e) => {
        onSubmit(e);
        inputRef.current?.blur();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        name="task"
        className="input__box"
        placeholder="enter task"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button className="input__submit">Go</button>
    </form>
  );
};
export default InputField;
