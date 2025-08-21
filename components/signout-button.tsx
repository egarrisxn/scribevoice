import { signOut } from "@/app/actions";

//! Server-Side Sign Out
export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="cursor-pointer text-sm font-medium text-primary transition-all duration-150 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4 sm:text-base"
      >
        Sign Out
      </button>
    </form>
  );
}

//! Client-Side Sign Out
// export default function SignOutButton() {
//   return (
//     <form action="/auth/signout" method="post">
//       <Button type="submit">Sign out</Button>
//     </form>
//   );
// }
