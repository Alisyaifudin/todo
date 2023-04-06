import ThemeButton from "./ThemeButton";

function Navigation() {
  return (
    <nav className="mx-auto flex max-w-3xl justify-end px-2">
      <ul className="flex gap-4 py-2 items-center">
        <li>
          <a href="/">Masuk</a>
        </li>
        <li>
          <ThemeButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
