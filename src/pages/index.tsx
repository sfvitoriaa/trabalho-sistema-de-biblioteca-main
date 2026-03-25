import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="home-hero card">
        <div className="hero-text">
          <h1>Bem-vindo à Biblioteca</h1>
          <p>Explore os recursos: gerencie usuários, acervo e empréstimos com facilidade.</p>
        </div>
        <div>
          <Link href="/" className="btn btn-secondary">Painel</Link>
        </div>
      </div>

      <div className="cards-grid">
        <Link href="/usuarios" className="home-card">
          <div className="icon" aria-hidden="true" />
          <h3>Usuários</h3>
          <p>Adicionar, editar e gerenciar os usuários da biblioteca.</p>
          <div style={{marginTop:12, fontWeight:700}}>Ir para Usuários →</div>
        </Link>

        <Link href="/livros" className="home-card">
          <div className="icon" aria-hidden="true" />
          <h3>Acervo</h3>
          <p>Visualize, cadastre e atualize informações dos títulos.</p>
          <div style={{marginTop:12, fontWeight:700}}>Ir para Livros →</div>
        </Link>

        <Link href="/emprestimos" className="home-card">
          <div className="icon" aria-hidden="true" />
          <h3>Empréstimos</h3>
          <p>Gerencie empréstimos, devoluções e o histórico.</p>
          <div style={{marginTop:12, fontWeight:700}}>Ir para Empréstimos →</div>
        </Link>
      </div>

    </div>
  );
}
