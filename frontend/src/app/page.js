import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>SkillSync</h1>
      <p>AI-powered career intelligence and recruitment platform.</p>
      <nav>
        <Link href="/jobs">Browse Jobs</Link> | <Link href="/applications">My Applications</Link>
      </nav>
    </main>
  );
}
