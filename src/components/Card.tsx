import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { api } from "~/utils/api";

interface CardProps {
  title: string;
  children: string;
  id: string;
  done: boolean;
}

export default function Card({ title, children, id, done }: CardProps) {
  const [isDone, setIsDone] = useState(done);
  const mutation = api.task.done.useMutation();
  const handleCheck = () => {
    setIsDone(!isDone);
    mutation.mutate({ id, done: !isDone });
  };
  return (
    <div className="w-full rounded-md border p-2">
      <div className="flex  justify-between">
        <h2 className="font-bold" onClick={handleCheck}>
          {title}
        </h2>
        <div className="flex gap-2">
          <button className="underline">Sunting</button>
          <button className="text-red-500 underline">Hapus</button>
        </div>
      </div>
      <p className={twMerge("px-1", isDone && "line-through")}>{children}</p>
    </div>
  );
}
