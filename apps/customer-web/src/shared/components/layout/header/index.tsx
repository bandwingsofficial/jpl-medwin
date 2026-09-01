import { TopActionBar } from "./top-action-bar";
import { CategoryNavBar } from "./category-nav-bar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div><TopActionBar /></div>
      <CategoryNavBar />
    </header>
  );
}