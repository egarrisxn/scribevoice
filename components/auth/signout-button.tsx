import { signOut } from "@/app/actions";
import { Button } from "@/components/ui/button";

//! Server-Side Sign Out
export default function SignOutButton() {
  return (
    <form action={signOut}>
      <Button variant="link" type="submit">
        Sign Out
      </Button>
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
