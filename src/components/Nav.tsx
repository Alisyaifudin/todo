import ThemeButton from "./ThemeButton";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

function Navigation() {
  return (
    <nav className="mx-auto flex max-w-3xl justify-end px-2">
      <ul className="flex items-center gap-4 py-2">
        <li>
          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton />
          </SignedIn>
          <SignedOut>
            {/* Signed out users get sign in button */}
            <SignInButton>Masuk</SignInButton>
          </SignedOut>
        </li>
        <li>
          <ThemeButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
