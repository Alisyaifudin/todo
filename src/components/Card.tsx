import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { api } from "~/utils/api";
import { AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "./ui/input";
import Spinner from "./Spinner";
import { useSession } from "next-auth/react";

interface CardProps {
  title: string;
  children: string;
  id: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function Card({
  title,
  children,
  id,
  done,
  createdAt,
  updatedAt,
}: CardProps) {
  const utils = api.useContext();
  const { data: session } = useSession();
  const isSignedIn = !!session?.user?.name;
  const [isDone, setIsDone] = useState(done);
  const [isEdit, setIsEdit] = useState(false);
  const [edit, setEdit] = useState({ title, description: children });
  const [isLoading, setIsLoading] = useState(false);
  const mutationDone = api.task.done.useMutation({
    async onSuccess() {
      await utils.task.getAll.invalidate();
    },
    onError() {
      setIsDone(!isDone);
    },
  });
  const mutationDelete = api.task.delete.useMutation({
    async onSuccess() {
      await utils.task.getAll.invalidate();
      setIsLoading(false);
    },
    onError() {
      setIsLoading(false);
    },
  });
  const mutationEdit = api.task.edit.useMutation({
    async onSuccess() {
      await utils.task.getAll.invalidate();
      setIsEdit(false);
      setIsLoading(false);
    },
    onError() {
      setIsLoading(false);
      setIsEdit(false);
    },
  });
  const handleCheck = () => {
    if (!isSignedIn) return;
    setIsDone(!isDone);
    mutationDone.mutate({ id, done: !isDone });
  };
  const handleDelete = () => {
    if (!isSignedIn) return;
    mutationDelete.mutate(id);
    setIsLoading(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;
    if (e.target.value.length > 31) return;
    setEdit({ ...edit, title: e.target.value });
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!isSignedIn) return;
    if (e.target.value.length > 153) return;
    setEdit({ ...edit, description: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignedIn) return;
    if (!edit.title.length || !edit.description.length) return;
    if (edit.title === title && edit.description === children) {
      setIsEdit(false);
      return;
    }
    setIsLoading(true);
    mutationEdit.mutate({
      id,
      title: edit.title,
      description: edit.description,
    });
  };
  return (
    <div className="w-full rounded-md border">
      {!isEdit ? (
        <div className="relative flex flex-col p-2">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-black bg-opacity-70">
              <Spinner />
            </div>
          )}
          <div className="flex  justify-between">
            <h2
              className={twMerge("font-bold", isDone && "line-through")}
              onClick={handleCheck}
            >
              {title}
            </h2>
            {isSignedIn && (
              <div className="flex gap-2">
                <button
                  onClick={() => !isDone && setIsEdit(true)}
                  className="underline disabled:cursor-not-allowed disabled:text-slate-300"
                  disabled={isDone}
                >
                  Sunting
                </button>
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
            )}
          </div>
          <p className={twMerge("px-1", isDone && "line-through")}>
            {children}
          </p>
          <div className="flex">
            <p className="text-[0.6rem] text-slate-400">
              dibuat:&nbsp;
              {createdAt.toLocaleTimeString("id-ID")},&nbsp;
              {createdAt.toLocaleDateString("id-ID", { dateStyle: "short" })}
              &nbsp;
            </p>
            {updatedAt?.getTime() !== createdAt.getTime() && (
              <p className="text-[0.6rem] text-slate-400">
                {" | "}
                diubah:&nbsp;
                {updatedAt.toLocaleTimeString("id-ID")},&nbsp;
                {updatedAt?.toLocaleDateString("id-ID", { dateStyle: "short" })}
              </p>
            )}
          </div>
        </div>
      ) : (
        <form
          className="relative flex flex-col gap-2 p-2"
          onSubmit={handleSubmit}
        >
          {/* overlay with dark div */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-black bg-opacity-30">
              <Spinner />
            </div>
          )}
          <div className="flex justify-between gap-2">
            <Input onChange={handleTitleChange} value={edit.title} />
            <div className="flex gap-2">
              <button
                disabled={!edit.title.length || !edit.description.length}
                className="underline disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Selesai
              </button>
            </div>
          </div>
          <Textarea
            onChange={handleDescriptionChange}
            value={edit.description}
            className="max-h-[6rem] min-h-[3rem]"
          />
        </form>
      )}
    </div>
  );
}
