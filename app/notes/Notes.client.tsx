"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import Pagination from "../../components/Pagination/Pagination";
import NoteList from "../../components/NoteList/NoteList";
import NoteModal from "../../components/NoteModal/NoteModal";
import SearchBox from "../../components/SearchBox/SearchBox";
import type { Note } from "@/types/note";
import css from "./NotesPage.module.css";

type Props = {
  initialSearch: string;
  initialPage: number;
  initialData: {
    notes: Note[];
    totalPages: number;
  };
};

export default function NotesClient({
  initialSearch,
  initialPage,
  initialData,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(searchText, 300);

  const notes = useQuery({
    queryKey: ["notes", debouncedSearch, currentPage],
    queryFn: () => fetchNotes(debouncedSearch, currentPage),
    placeholderData: keepPreviousData,
    initialData:
      debouncedSearch === initialSearch && currentPage === initialPage
        ? initialData
        : undefined,
  });

  const totalPages = notes.data?.totalPages ?? 0;

  const handleSearchChange = (newSearch: string): void => {
    setSearchText(newSearch);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchText} onSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        )}
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
          disabled={isModalOpen}
        >
          Create note +
        </button>
      </header>

      {notes.isLoading && <p>Loading...</p>}
      {notes.isError && <p>Error loading notes.</p>}
      {!notes.isLoading && !notes.isError && (
        <NoteList notes={notes.data?.notes ?? []} />
      )}

      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
