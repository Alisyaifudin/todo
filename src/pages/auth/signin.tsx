import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password-input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "~/hooks/use-toast";

const schema = z.object({
  email: z.string().email({
    message: "Email tidak valid",
  }),
  password: z
    .string({
      invalid_type_error: "Password harus berupa string",
      required_error: "Password harus diisi",
    })
    .min(1, {
      message: "Password harus lebih dari 1 karakter",
    }),
});

const defaultErrorMessage = [
  {
    code: "NOT_FOUND",
    message: "Email atau password salah",
  },
  {
    code: "BAD_REQUEST",
    message: "Email atau password harus diisi",
  },
  {
    code: "INVALID_REQUEST",
    message: "Email atau password salah",
  },
];

export default function SignIn() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const query = router.query;
  const defaultError = !!query.error
    ? defaultErrorMessage
        .filter((code) => code.code == (query.error as string))
        .map((code) => code.message)
    : "";
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(defaultError);
  useEffect(() => {
    if (query.success && query.success == "REGISTER_SUCCESS") {
      toast({
        variant: "success",
        description: "Anda berhasil mendaftar",
      });
    }
  }, [query]);
  if (session?.user?.name) {
    router.push("/");
    return null;
  }
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
    setError("");
    const callbackUrl =
      typeof router.query.callbackUrl === "string"
        ? router.query.callbackUrl
        : "/";

    signIn("credentials", {
      email: form.email,
      password: form.password,
      callbackUrl,
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        className="mb-4 w-full rounded bg-white px-8 pb-8 pt-6 shadow-md dark:bg-gray-800 sm:w-[500px]"
        data-cy="signin-form"
        onSubmit={handleSubmit}
      >
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
            onChange={handleFormChange}
            value={form.email}
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
            onChange={handleFormChange}
            value={form.password}
          />
        </div>
        {error && (
          <div className="mb-4 text-sm text-red-500">
            <p>{error}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Button
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Masuk
          </Button>
          <Link href="/auth/signup" legacyBehavior>
            <a className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800">
              Buat
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
}
