import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const links = [
  { href: "/",            label: "Início"      },
  { href: "/usuarios",    label: "Usuários"    },
  { href: "/livros",      label: "Livros"      },
  { href: "/emprestimos", label: "Empréstimos" },
];

function Navbar() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">📚 Biblioteca Virtual</Link>
        <button 
          className="navbar-toggle" 
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <nav className={`navbar-links ${open ? "show" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <main className="page-content">
        <Component {...pageProps} />
      </main>
    </>
  );
}
