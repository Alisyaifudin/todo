import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const SIGNIN_ERROR = ["NOT_FOUND", "BAD_REQUEST", "INVALID_REQUEST"];

const ErrorPage = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { query } = router;
  console.log("AAAAA");
  console.log(query.error);
  useEffect(() => {
    if (query.error) {
      setMounted(true);
    }
  }, [query]);
  if (mounted) {
    console.log("BBBBB");
    console.log(query.error);
    if (SIGNIN_ERROR.includes(query.error as string)) {
      console.log(query.error);
      router.push(`/auth/signin?error=${query.error}`);
    } else {
      console.log("CCCCC");
      console.log(query.error);
      return (
        <>
          <Head>
            <title>Error Page</title>
          </Head>
          <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
              <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">
                Error
              </h1>
              {Object.keys(query).length > 0 && (
                <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
                  Query parameters: {JSON.stringify(query)}
                </p>
              )}
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Sorry, the page you requested could not be found.
              </p>
            </div>
          </div>
        </>
      );
    }
  }
  return null;
};

export default ErrorPage;
