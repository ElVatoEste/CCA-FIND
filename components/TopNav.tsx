import { NavBar } from "@/components/NavBar";
import { getCurrentUser } from "@/lib/session";

export async function TopNav({ active }: { active?: string }) {
  const user = await getCurrentUser();

  return (
    <NavBar
      active={active}
      user={user ? { name: user.name ?? "", role: user.role } : null}
    />
  );
}
