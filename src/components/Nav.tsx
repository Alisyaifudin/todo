import ThemeButton from "./ThemeButton";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

function Navigation() {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user?.name;
  return (
    <nav className="mx-auto flex max-w-3xl justify-end px-2">
      <ul className="flex items-center gap-4 py-2">
        <li>
          {isSignedIn ? (
            <button onClick={() => signOut()}>Keluar</button>
          ) : (
            <Link href="/auth/signin" legacyBehavior>
              <a>Masuk</a>
            </Link>
          )}
        </li>
        <li>
          <ThemeButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
