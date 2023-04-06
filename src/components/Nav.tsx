import { Sun } from "lucide-react";

function Navigation() {
  return (
    <nav className="mx-auto flex max-w-3xl justify-end px-2">
      <ul className="flex gap-4 py-2">
        <li>
          <a href="/">Masuk</a>
        </li>
        <li>
          <button>
            <Sun />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
