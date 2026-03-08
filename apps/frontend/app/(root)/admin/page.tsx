import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/server-user";
import GetUsers from "./get-users";

export default async function AdminPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <GetUsers />
    </div>
  );
}
