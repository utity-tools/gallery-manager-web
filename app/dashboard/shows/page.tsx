import type { Metadata } from "next";
import ShowsManager from "@/components/dashboard/shows/ShowsManager";

export const metadata: Metadata = {
  title: "Exhibitions | Gallery Manager",
};

export default function ShowsPage() {
  return <ShowsManager />;
}
