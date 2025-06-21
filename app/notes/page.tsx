import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export default async function AppPage() {
  const initialSearch = "";
  const initialPage = 1;
  const perPage = 12;

  const initialData = await fetchNotes(initialSearch, initialPage, perPage);

  return (
    <NotesClient
      initialSearch={initialSearch}
      initialPage={initialPage}
      initialData={initialData}
    />
  );
}
