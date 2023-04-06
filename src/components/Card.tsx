import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { api } from "~/utils/api";
import { AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface CardProps {
  title: string;
  children: string;
  id: string;
  done: boolean;
}

export default function Card({ title, children, id, done }: CardProps) {
  const utils = api.useContext();
  const [isDone, setIsDone] = useState(done);
  const mutationDone = api.task.done.useMutation();
  const mutationDelete = api.task.delete.useMutation({
    onSuccess() {
      utils.task.getAll.invalidate();
    },
  });
  const handleCheck = () => {
    setIsDone(!isDone);
    mutationDone.mutate({ id, done: !isDone });
  };
  const handleDelete = () => {
    mutationDelete.mutate(id);
  };
  return (
    <div className="w-full rounded-md border p-2">
      <div className="flex  justify-between">
        <h2 className="font-bold" onClick={handleCheck}>
          {title}
        </h2>
        <div className="flex gap-2">
          <button className="underline">Sunting</button>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-red-500 underline">
              Hapus
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-fit">
              <DropdownMenuItem className="w-fit">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-red-500"
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  <span>Yakin?</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className={twMerge("px-1", isDone && "line-through")}>{children}</p>
    </div>
  );
}
