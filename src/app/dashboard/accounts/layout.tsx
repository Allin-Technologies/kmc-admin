import { notFound } from "next/navigation";
import { auth } from "../../../../auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "admin") notFound();

  return children;
}
