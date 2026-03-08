"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function GetUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    apiFetch("/users", { credentials: "include" }).then((data) => setUsers(data as User[])).catch(console.error);
  }, []);

  return (
    <>
      {users.map((u) => (
        <div key={u.id}>
          {u.email} - {u.role}
        </div>
      ))}
    </>
  );
}
