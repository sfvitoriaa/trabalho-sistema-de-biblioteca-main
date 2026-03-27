import Link from "next/link";

export default function Home() {
  return (
    <div style={{maxWidth:800, margin:"20px auto", padding:"10px"}}>
        <h1>Bem-vindo à Biblioteca</h1>
        <p>Explore os recursos: gerencie usuários, acervo e empréstimos.</p>

      <div>
        <Link href="/usuarios" style={{display:"block", border:"1px solid #ccc", padding:"10px", marginBottom:"10px", textDecoration:"none", color:"#333"}}>
          <h3>Usuários</h3>
          <p>Gerenciar os usuários da biblioteca.</p>
        </Link>

        <Link href="/livros" style={{display:"block", border:"1px solid #ccc", padding:"10px", marginBottom:"10px", textDecoration:"none", color:"#333"}}>
          <h3>Acervo</h3>
          <p>Visualizar e atualizar informações dos títulos.</p>
        </Link>

        <Link href="/emprestimos" style={{display:"block", border:"1px solid #ccc", padding:"10px", marginBottom:"10px", textDecoration:"none", color:"#333"}}>
          <h3>Empréstimos</h3>
          <p>Gerenciar empréstimos e devoluções.</p>
        </Link>
      </div>
    </div>
  );
}
