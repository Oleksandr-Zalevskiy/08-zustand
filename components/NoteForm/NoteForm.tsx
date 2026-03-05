"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

export default function NoteForm() {
  const router = useRouter();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const startValues = useMemo(() => draft ?? initialDraft, [draft]);

  const [values, setValues] = useState(startValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setValues(startValues);
  }, [startValues]);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;

    const next = { ...values, [name]: value };
    setValues(next);
    setDraft(next);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    if (!values.title.trim() || !values.content.trim()) {
      setError("Title and Content are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createNote({
        title: values.title.trim(),
        content: values.content.trim(),
        tag: values.tag,
      });

      clearDraft();
      router.back();
    } catch {
      setError("Failed to create note. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} onChange={handleChange}>
      <div className={css.field}>
        <label className={css.label} htmlFor="title">
          Title
        </label>
        <input
          className={css.input}
          id="title"
          name="title"
          type="text"
          value={values.title}
          autoComplete="off"
        />
      </div>

      <div className={css.field}>
        <label className={css.label} htmlFor="content">
          Content
        </label>
        <textarea
          className={css.textarea}
          id="content"
          name="content"
          value={values.content}
          rows={6}
        />
      </div>

      <div className={css.field}>
        <label className={css.label} htmlFor="tag">
          Tag
        </label>
        <select className={css.select} id="tag" name="tag" value={values.tag}>
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {error && <p className={css.error}>{error}</p>}

      <div className={css.actions}>
        <button className={css.submitBtn} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </button>

        <button
          className={css.cancelBtn}
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
