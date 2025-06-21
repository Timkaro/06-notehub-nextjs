import type { Note, CreateNote } from "../types/note";
import axios from "axios";

const API_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!token) {
  throw new Error("Environment variable is not set");
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotes {
  notes: Note[];
  totalPages: number;
}
interface FetchParams {
  search?: string;
  page?: number;
  perPage?: number;
}

export async function fetchNotes(
  searchText: string,
  page: number,
  perPage: number = 12,
): Promise<FetchNotes> {
  try {
    const params: FetchParams = {
      ...(searchText.trim() !== "" && { search: searchText.trim() }),
      page,
      perPage,
    };
    const res = await axiosInstance.get<FetchNotes>("/notes", { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw new Error("Could not fetch notes. Please try again later.");
  }
}

export async function createNote(newNote: CreateNote): Promise<Note> {
  try {
    const res = await axiosInstance.post<Note>("/notes", newNote);
    return res.data;
  } catch (error) {
    console.error("Failed to create note:", error);
    throw new Error("Could not create note. Please try again.");
  }
}

export async function deleteNote(noteId: number): Promise<Note> {
  try {
    const res = await axiosInstance.delete<Note>(`/notes/${noteId}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete note with ID ${noteId}:`, error);
    throw new Error("Could not delete the note.");
  }
}

export async function fetchNoteById(noteId: number): Promise<Note> {
  try {
    const res = await axiosInstance.get<Note>(`/notes/${noteId}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch note with ID ${noteId}:`, error);
    throw new Error("Could not fetch note details.");
  }
}
