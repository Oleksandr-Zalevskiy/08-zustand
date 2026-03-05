"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "../Modal/Modal";
import css from "./NotePreview.module.css";

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Failed to load note data.</p>}

        {data && (
          <>
            <h2>{data.title}</h2>
            <p>{data.content}</p>
            <p>{data.tag}</p>
          </>
        )}
      </div>
    </Modal>
  );
}
