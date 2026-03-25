import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";

const links = [
  { href: "/",            label: "Início"      },
  { href: "/usuarios",    label: "Usuários"    },
  { href: "/livros",      label: "Livros"      },
  { href: "/emprestimos", label: "Empréstimos" },
];

function Navbar() {
  const { pathname } = useRouter();
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">Biblioteca Virtual</Link >
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={pathname === l.href ? "active" : ""}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
