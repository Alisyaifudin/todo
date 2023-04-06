import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { Portal } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { api } from "~/utils/api";
import Spinner from "./Spinner";
import { Button } from "./ui/button";

export function NewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const utils = api.useContext();
  const mutation = api.task.create.useMutation({
    async onSuccess() {
      await utils.task.getAll.invalidate();
      setOpen(false);
      setTitle("");
      setDescription("");
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 31) return;
    setTitle(e.target.value);
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length > 153) return;
    setDescription(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.length || !description.length) return;
    mutation.mutate({ title, description });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="absolute bottom-10 right-10">
        <button>
          <Plus className="h-10 w-10 rounded-full border" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {mutation.isLoading && (
          <Portal>
            <DialogOverlay className="absolute inset-0 z-[100] flex h-screen items-center justify-center bg-black/50 backdrop-filter">
              <Spinner />
            </DialogOverlay>
          </Portal>
        )}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tugas Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Judul
              </label>
              <Input
                value={title}
                onChange={handleTitleChange}
                id="title"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Deskripsi
              </label>
              <Textarea
                onChange={handleDescriptionChange}
                value={description}
                className="col-span-3 max-h-[120px] min-h-[40px] border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!title.length || !description.length}
              type="submit"
              className="disabled:cursor-not-allowed"
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
