import { useState, useEffect } from "react";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    fetch("/api/list/usuarios")
      .then(r => r.json())
      .then(d => setUsuarios(d.usuarios || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/create/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ nome: "", email: "", telefone: "" });
    const d = await fetch("/api/list/usuarios").then(r => r.json());
    setUsuarios(d.usuarios || []);
  }

  return (
    <div className="container">
      <h1>👥 Gestão de Usuários</h1>

      {/* Formulário */}
      <form className="card" onSubmit={handleSubmit}>
        <h2>➕ Novo usuário</h2>
        <label>👤 Nome completo</label>
        <input
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          required
        />
        <label>📧 E-mail</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <label>📱 Telefone</label>
        <input
          value={form.telefone}
          onChange={e => setForm({ ...form, telefone: e.target.value })}
          required
        />
        <button className="btn btn-primary">Cadastrar usuário</button>
      </form>

      {/* Botão para mostrar/ocultar lista */}
      <div className="card">
        <button 
          className="btn btn-primary" 
          onClick={() => setMostrarLista(!mostrarLista)}
        >
          {mostrarLista ? "Ocultar lista de usuários" : "Mostrar lista de usuários"}
        </button>

        {mostrarLista && (
          <div className="grid-2" style={{marginTop:"20px"}}>
            {usuarios.length === 0 ? (
              <p>Nenhum usuário cadastrado.</p>
            ) : (
              usuarios.map(u => (
                <div key={u.id} className="usuario-card">
                  <h3>{u.nome}</h3>
                  <p><span className="badge badge-email">📧 {u.email}</span></p>
                  <p><span className="badge badge-telefone">📱 {u.telefone}</span></p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
