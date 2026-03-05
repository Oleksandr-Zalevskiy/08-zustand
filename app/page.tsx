import css from "./Home.module.css";

export default function Home() {
  return (
    <main>
      <div className={css.container}>
        <h1 className={css.title}>Welcome to NoteHub</h1>
      </div>
    </main>
  );
}
