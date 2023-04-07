import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PasswordInput } from "~/components/ui/password-input";
import { api } from "~/utils/api";

const passwordSchema = z
  .string()
  .min(6, "Password harus lebih dari 5 karakter")
  .refine(
    (value) =>
      // check if the value contains at least one lowercase letter
      /[a-z]/.test(value),
    "Password harus mengandung huruf kecil"
  )
  .refine(
    (value) =>
      // check if the value contains at least one uppercase letter
      /[A-Z]/.test(value),
    "Password harus mengandung huruf besar"
  )
  .refine(
    (value) =>
      // check if the value contains at least one number
      /[0-9]/.test(value),
    "Password harus mengandung angka"
  )
  .refine(
    (value) =>
      // check if the value contains at least one special character
      /[!@#$%^&*(),.?":{}|<>]/.test(value),
    "Password harus mengandung karakter spesial"
  );

export const schema = z.object({
  name: z.string().min(1, {
    message: "Name harus minimal 1 karakter",
  }),
  email: z.string().email({
    message: "Email tidak valid",
  }),
  password: passwordSchema,
});

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const mutation = api.user.create.useMutation({
    onSuccess: () => {
      router.push("/auth/signin?success=REGISTER_SUCCESS");
    },
    onError: (error) => {
      const message = error.message;
      setError(message);
    },
  });
  const [error, setError] = useState("");
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parse = schema.safeParse(form);
    if (!parse.success) {
      const message = parse.error.issues
        .map((issue) => `${issue.message}`)
        .join("; ");
      setError(message);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password tidak sama");
      return;
    }
    setError("");
    mutation.mutate(form);
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        className="mb-4 w-full rounded bg-white px-8 pb-8 pt-6 shadow-md dark:bg-gray-800 sm:w-[500px]"
        data-cy="signup-form"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <Label
            className="mb-2 block font-bold text-gray-700 dark:text-gray-200"
            htmlFor="name"
          >
            Name
          </Label>
          <Input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:text-gray-200"
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleFormChange}
          />
        </div>
        <div className="mb-4">
          <Label
            className="mb-2 block font-bold text-gray-700 dark:text-gray-200"
            htmlFor="email"
          >
            Email
          </Label>
          <Input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:text-gray-200"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleFormChange}
          />
        </div>
        <div className="mb-6">
          <Label
            className="mb-2 block font-bold text-gray-700 dark:text-gray-200"
            htmlFor="password"
          >
            Password
          </Label>
          <PasswordInput
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:text-gray-200"
            id="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleFormChange}
          />
        </div>
        <div className="mb-6">
          <Label
            className="mb-2 block font-bold text-gray-700 dark:text-gray-200"
            htmlFor="confirm-password"
          >
            Confirm Password
          </Label>
          <PasswordInput
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:text-gray-200"
            id="confirm-password"
            name="confirmPassword"
            placeholder="Password"
            value={form.confirmPassword}
            onChange={handleFormChange}
          />
        </div>
        {error ? (
          <div className="mb-4 text-sm text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="mb-4 text-sm">
            <p>&nbsp;</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Button
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Buat
          </Button>
          <Link href="/auth/signin" legacyBehavior>
            <a className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800">
              Masuk
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
}
