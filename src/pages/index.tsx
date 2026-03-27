import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      {/* Hero */}
      <header className="hero">
        <h1>📚 Biblioteca Virtual</h1>
        <p>Gerencie usuários, acervo e empréstimos de forma simples e moderna.</p>
      </header>

      {/* Seções */}
      <div className="grid-3">
        <Link href="/usuarios" className="card home-card usuarios-card">
          <h2>👥 Usuários</h2>
          <p>Cadastro e gerenciamento de usuários.</p>
        </Link>

        <Link href="/livros" className="card home-card livros-card">
          <h2>📖 Acervo</h2>
          <p>Visualizar e atualizar informações dos livros.</p>
        </Link>

        <Link href="/emprestimos" className="card home-card emprestimos-card">
          <h2>🔄 Empréstimos</h2>
          <p>Controle de empréstimos e devoluções.</p>
        </Link>
      </div>
    </div>
  );
}
