"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    name: "Chat",
    path: "/",
  },
  {
    name: "Profile",
    path: "/profile",
  },
];

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="p-4 flex flex-row justify-between items-center bg-black text-white">
      <Link href="/">
        <h1 className="text-2xl font-bold">GogginsAI</h1>
      </Link>
      <div className="flex gap-x-6 text-lg items-center">
        {routes.map((route) => (
          <Link
            className={
              pathname === route.path ? "border-b-2 border-yellow-500" : ""
            }
            key={`${route.name}__${route.path}`}
            href={route.path}
          >
            {route.name}
          </Link>
        ))}
        <UserButton></UserButton>
      </div>
    </div>
  );
};

export default Navbar;
