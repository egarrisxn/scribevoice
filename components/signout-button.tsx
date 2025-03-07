import { signOut } from "@/app/actions";

//! Server-Side Sign Out
export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-primary cursor-pointer text-sm font-medium underline-offset-4 hover:text-blue-400 hover:underline sm:text-base"
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
