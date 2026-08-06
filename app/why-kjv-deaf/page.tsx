import { redirect } from "next/navigation";

// This content now lives on the About page. Redirect any existing links there.
export default function WhyKjvDeafPage() {
  redirect("/about");
}
