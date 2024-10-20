import { useUser } from "@clerk/nextjs";

export function useAdminCheck() {
  const { user } = useUser();
  return user?.primaryEmailAddress?.emailAddress === "bluehawana@gmail.com";
}