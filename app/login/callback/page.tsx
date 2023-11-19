import { Login } from "@/components/login";

export default async function LoginCallback({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <Login code={searchParams.code as string} />;
}
