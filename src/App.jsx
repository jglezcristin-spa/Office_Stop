import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  LogOut, FileText, Image as ImageIcon, BookOpen, ShoppingCart,
  Download, Plus, Minus, Check, Lock, User, X, Search, Send, Pencil, Loader2
} from "lucide-react";

// ====== Marca: Office Stop ======
const EMPRESA = "Office Stop";
const S = {
  paper: "#F8F7F1",   // fondo claro
  ink: "#1D1D1B",     // negro del logo
  line: "#E3E1D7",    // bordes suaves
  brand: "#7BA00F",   // verde limón (oscurecido para buen contraste en botones)
  brandDark: "#161616", // negro de barra superior
  gold: "#F7CE17",    // amarillo lápiz
  lime: "#A8CC2B",    // verde limón brillante (acentos)
};
// ================================

function Marca({ claro }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md flex items-center justify-center -rotate-6"
        style={{ background: S.gold }}>
        <Pencil size={17} color={S.ink} />
      </div>
      <div>
        <div className="font-bold leading-none tracking-wide" style={{ fontSize: 15, color: claro ? "#fff" : S.ink }}>
          Office <span style={{ color: S.lime }}>Stop</span>
        </div>
        <div className="leading-none mt-0.5" style={{ fontSize: 10, letterSpacing: 2, color: claro ? "#ffffffAA" : "#6B7076" }}>PORTAL DE CLIENTES</div>
      </div>
    </div>
  );
}

function Cargando({ texto = "Cargando…" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12" style={{ color: "#9AA0A6" }}>
      <Loader2 size={18} className="animate-spin" /> <span style={{ fontSize: 14 }}>{texto}</span>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const entrar = async () => {
    setError("");
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass,
    });
    setCargando(false);
    if (error) setError("Correo o contraseña incorrectos. Si olvidaste tu acceso, contacta a tu asesor.");
  };

  return (
    <div className="min-h-screen flex" style={{ background: S.paper }}>
      <div className="hidden md:flex flex-col justify-between p-10 w-1/2"
        style={{ background: "linear-gradient(165deg, #121212 55%, #2C3B0B)" }}>
        <Marca claro />
        <div>
          <img src="/logo.png" alt="Office Stop"
            style={{ maxWidth: 280, marginBottom: 20 }} />
          <div className="inline-block px-3 py-1 rounded-full mb-4 font-semibold"
            style={{ background: "#A8CC2B22", color: S.lime, fontSize: 12, letterSpacing: 0.5, border: "1px solid #A8CC2B55" }}>
            Distribuidor autorizado de Studmark en Panamá
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: 38, lineHeight: 1.1, fontFamily: "Georgia, serif" }}>
            Todo para tu oficina<br />y tu escuela,<br />
            <span style={{ color: S.lime }}>en un solo lugar.</span>
          </h1>
          <p className="text-white mt-4" style={{ opacity: 0.7, maxWidth: 380 }}>
            Accede con tu cuenta para ver los catálogos Studmark y de línea general, fotos de productos y solicitar cotizaciones al instante.
          </p>
        </div>
        <div className="text-white" style={{ fontSize: 12, opacity: 0.5 }}>
          © {new Date().getFullYear()} {EMPRESA} · Distribuidor autorizado de Studmark en Panamá
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full" style={{ maxWidth: 380 }}>
          <div className="md:hidden mb-8"><Marca /></div>
          <h2 className="font-bold" style={{ fontSize: 26, color: S.ink, fontFamily: "Georgia, serif" }}>Iniciar sesión</h2>
          <p className="mt-1 mb-6" style={{ color: "#6B7076", fontSize: 14 }}>Usa las credenciales que te entregó tu asesor.</p>

          <label className="block mb-1 font-medium" style={{ fontSize: 13, color: S.ink }}>Correo electrónico</label>
          <div className="flex items-center gap-2 rounded-md px-3 py-2.5 mb-4 bg-white" style={{ border: `1px solid ${S.line}` }}>
            <User size={16} color="#9AA0A6" />
            <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="tu@correo.com" autoComplete="email"
              className="flex-1 outline-none bg-transparent" style={{ fontSize: 14 }} />
          </div>

          <label className="block mb-1 font-medium" style={{ fontSize: 13, color: S.ink }}>Contraseña</label>
          <div className="flex items-center gap-2 rounded-md px-3 py-2.5 bg-white" style={{ border: `1px solid ${S.line}` }}>
            <Lock size={16} color="#9AA0A6" />
            <input type="password" value={pass} onChange={e => { setPass(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && entrar()} autoComplete="current-password"
              placeholder="••••••••" className="flex-1 outline-none bg-transparent" style={{ fontSize: 14 }} />
          </div>

          {error && <div className="mt-3 rounded-md px-3 py-2" style={{ background: "#FDECEA", color: "#8A2A22", fontSize: 13 }}>{error}</div>}

          <button onClick={entrar} disabled={cargando}
            className="w-full mt-5 py-3 rounded-md font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: S.brand, fontSize: 15, opacity: cargando ? 0.7 : 1 }}>
            {cargando && <Loader2 size={16} className="animate-spin" />} Entrar al portal
          </button>
        </div>
      </div>
    </div>
  );
}

function Catalogos({ lista, onError }) {
  const tonos = ["#7BA00F", "#C79B06", "#33393F", "#4E6410", "#8A6D00"];
  const urlPortada = (ruta) => supabase.storage.from("fotos").getPublicUrl(ruta).data.publicUrl;

  const abrir = async (c) => {
    const { data, error } = await supabase.storage.from("archivos").createSignedUrl(c.ruta_archivo, 3600);
    if (error || !data?.signedUrl) return onError("No se pudo abrir el catálogo. Verifica que el archivo exista en Storage.");
    window.open(data.signedUrl, "_blank");
  };

  if (!lista.length) return <VacioMsg texto="Aún no hay catálogos publicados." />;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {lista.map((c, i) => (
        <div key={c.id} className="bg-white rounded-lg overflow-hidden flex flex-col" style={{ border: `1px solid ${S.line}` }}>
          {c.portada ? (
            <div className="h-32 overflow-hidden">
              <img src={urlPortada(c.portada)} alt={c.titulo}
                className="w-full h-full object-cover" loading="lazy" />
            </div>
          ) : (
            <div className="h-32 flex items-end p-4"
              style={{ background: `linear-gradient(140deg, ${tonos[i % tonos.length]}, ${tonos[i % tonos.length]}CC)` }}>
              <BookOpen color="#fff" size={28} style={{ opacity: 0.9 }} />
            </div>
          )}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold" style={{ color: S.ink, fontSize: 15 }}>{c.titulo}</h3>
            <p className="mt-1 flex-1" style={{ fontSize: 13, color: "#6B7076" }}>{c.descripcion}</p>
            {c.paginas && <div className="mt-2" style={{ fontSize: 12, color: "#9AA0A6" }}>{c.paginas} páginas</div>}
            <button onClick={() => abrir(c)}
              className="mt-3 py-2 rounded-md font-medium text-white hover:opacity-90"
              style={{ background: S.brand, fontSize: 13 }}>
              Ver catálogo
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Galeria({ lista }) {
  const [abierta, setAbierta] = useState(null);
  const urlDe = (ruta) => supabase.storage.from("fotos").getPublicUrl(ruta).data.publicUrl;

  if (!lista.length) return <VacioMsg texto="Aún no hay fotos publicadas." />;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {lista.map(f => (
          <button key={f.id} onClick={() => setAbierta(f)}
            className="rounded-lg overflow-hidden text-left group bg-white" style={{ border: `1px solid ${S.line}` }}>
            <div className="h-36 overflow-hidden">
              <img src={urlDe(f.ruta_archivo)} alt={f.titulo}
                className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
            </div>
            <div className="px-3 py-2" style={{ fontSize: 13, color: S.ink }}>{f.titulo}</div>
          </button>
        ))}
      </div>
      {abierta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "#000000B3" }}
          onClick={() => setAbierta(null)}>
          <div className="w-full rounded-xl overflow-hidden bg-white" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <img src={urlDe(abierta.ruta_archivo)} alt={abierta.titulo} className="w-full max-h-[70vh] object-contain bg-black" />
            <div className="p-4 flex items-center justify-between">
              <div className="font-medium" style={{ color: S.ink }}>{abierta.titulo}</div>
              <button onClick={() => setAbierta(null)} className="p-1 rounded hover:bg-gray-100"><X size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Documentos({ lista, onError }) {
  const descargar = async (d) => {
    const { data, error } = await supabase.storage.from("archivos").createSignedUrl(d.ruta_archivo, 3600, { download: true });
    if (error || !data?.signedUrl) return onError("No se pudo descargar. Verifica que el archivo exista en Storage.");
    window.open(data.signedUrl, "_blank");
  };

  if (!lista.length) return <VacioMsg texto="Aún no hay documentos publicados." />;

  return (
    <div className="bg-white rounded-lg overflow-hidden" style={{ border: `1px solid ${S.line}` }}>
      {lista.map((d, i) => (
        <div key={d.id} className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderTop: i ? `1px solid ${S.line}` : "none" }}>
          <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: "#EFEBE2" }}>
            <FileText size={17} color={S.brand} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate" style={{ fontSize: 14, color: S.ink }}>{d.nombre}</div>
            <div style={{ fontSize: 12, color: "#9AA0A6" }}>{d.tipo}</div>
          </div>
          <button onClick={() => descargar(d)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium hover:opacity-80"
            style={{ border: `1px solid ${S.brand}`, color: S.brand, fontSize: 13 }}>
            <Download size={14} /> Descargar
          </button>
        </div>
      ))}
    </div>
  );
}

function Cotizacion({ productos, carrito, setCarrito, perfil, onError }) {
  const [busqueda, setBusqueda] = useState("");
  const [notas, setNotas] = useState("");
  const [enviada, setEnviada] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (id, delta) => {
    setCarrito(prev => {
      const cant = (prev[id] || 0) + delta;
      const nuevo = { ...prev };
      if (cant <= 0) delete nuevo[id]; else nuevo[id] = cant;
      return nuevo;
    });
  };

  const items = Object.entries(carrito);
  const filtrados = productos.filter(p =>
    `${p.nombre} ${p.codigo || ""} ${p.categoria || ""}`.toLowerCase().includes(busqueda.toLowerCase()));

  const enviar = async () => {
    setEnviando(true);
    const detalle = items.map(([id, cantidad]) => {
      const p = productos.find(x => x.id === id);
      return { producto: p.nombre, codigo: p.codigo, cantidad };
    });
    const { error } = await supabase.from("cotizaciones").insert({
      cliente_id: perfil.id,
      items: detalle,
      notas: notas.trim() || null,
    });
    setEnviando(false);
    if (error) return onError("No se pudo enviar la solicitud. Intenta de nuevo en un momento.");
    setCarrito({});
    setEnviada(true);
  };

  if (enviada) {
    return (
      <div className="bg-white rounded-lg p-8 text-center" style={{ border: `1px solid ${S.line}` }}>
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center" style={{ background: "#E3F0E6" }}>
          <Check size={28} color="#2E7D43" />
        </div>
        <h3 className="mt-4 font-bold" style={{ fontSize: 20, color: S.ink, fontFamily: "Georgia, serif" }}>Solicitud enviada</h3>
        <p className="mt-2" style={{ fontSize: 14, color: "#6B7076" }}>
          Recibimos tu solicitud a nombre de <strong>{perfil.nombre}</strong>. Tu asesor te responderá con precios y disponibilidad.
        </p>
        <button onClick={() => { setEnviada(false); setNotas(""); }}
          className="mt-5 px-4 py-2 rounded-md font-medium text-white" style={{ background: S.brand, fontSize: 14 }}>
          Hacer otra solicitud
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-5 gap-5">
      <div className="md:col-span-3">
        <div className="flex items-center gap-2 rounded-md px-3 py-2.5 bg-white mb-3" style={{ border: `1px solid ${S.line}` }}>
          <Search size={16} color="#9AA0A6" />
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar producto o código…" className="flex-1 outline-none bg-transparent" style={{ fontSize: 14 }} />
        </div>
        <div className="bg-white rounded-lg overflow-hidden" style={{ border: `1px solid ${S.line}` }}>
          {filtrados.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: i ? `1px solid ${S.line}` : "none" }}>
              <div className="flex-1 min-w-0">
                <div className="font-medium" style={{ fontSize: 14, color: S.ink }}>{p.nombre}</div>
                <div style={{ fontSize: 12, color: "#9AA0A6" }}>{[p.codigo, p.categoria].filter(Boolean).join(" · ")}</div>
              </div>
              {carrito[p.id] ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => cambiar(p.id, -1)} className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{ border: `1px solid ${S.line}` }}><Minus size={13} /></button>
                  <span className="w-6 text-center font-semibold" style={{ fontSize: 14 }}>{carrito[p.id]}</span>
                  <button onClick={() => cambiar(p.id, 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-white"
                    style={{ background: S.brand }}><Plus size={13} /></button>
                </div>
              ) : (
                <button onClick={() => cambiar(p.id, 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md font-medium hover:opacity-80"
                  style={{ border: `1px solid ${S.brand}`, color: S.brand, fontSize: 13 }}>
                  <Plus size={14} /> Agregar
                </button>
              )}
            </div>
          ))}
          {!filtrados.length && <div className="px-4 py-6 text-center" style={{ fontSize: 13, color: "#9AA0A6" }}>
            {productos.length ? "Sin resultados para esa búsqueda." : "Aún no hay productos cargados."}
          </div>}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white rounded-lg p-4 sticky top-4" style={{ border: `1px solid ${S.line}` }}>
          <h3 className="font-semibold flex items-center gap-2" style={{ fontSize: 15, color: S.ink }}>
            <ShoppingCart size={16} color={S.gold} /> Tu solicitud
          </h3>
          {items.length ? (
            <div className="mt-3">
              {items.map(([id, cant]) => {
                const p = productos.find(x => x.id === id);
                return (
                  <div key={id} className="flex justify-between py-1.5" style={{ fontSize: 13.5, color: S.ink }}>
                    <span className="truncate pr-2">{p?.nombre}</span>
                    <span className="font-semibold whitespace-nowrap">× {cant}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-3" style={{ fontSize: 13, color: "#9AA0A6" }}>Agrega productos de la lista para cotizar.</p>
          )}
          <textarea value={notas} onChange={e => setNotas(e.target.value)}
            placeholder="Notas para tu asesor (cantidades especiales, fechas de entrega, etc.)"
            className="w-full mt-3 rounded-md p-2.5 outline-none resize-none"
            rows={3} style={{ border: `1px solid ${S.line}`, fontSize: 13 }} />
          <button disabled={!items.length || enviando} onClick={enviar}
            className="w-full mt-3 py-2.5 rounded-md font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: items.length ? S.brand : "#B8BDB6", fontSize: 14, cursor: items.length ? "pointer" : "not-allowed" }}>
            {enviando ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Enviar solicitud de cotización
          </button>
        </div>
      </div>
    </div>
  );
}

function VacioMsg({ texto }) {
  return (
    <div className="bg-white rounded-lg py-12 text-center" style={{ border: `1px solid ${S.line}`, color: "#9AA0A6", fontSize: 14 }}>
      {texto}
    </div>
  );
}

export default function App() {
  const [sesion, setSesion] = useState(undefined); // undefined = verificando
  const [perfil, setPerfil] = useState(null);
  const [datos, setDatos] = useState(null);
  const [tab, setTab] = useState("catalogos");
  const [carrito, setCarrito] = useState({});
  const [aviso, setAviso] = useState("");

  // Mantener la sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Cargar perfil y contenido cuando hay sesión
  useEffect(() => {
    if (!sesion) { setPerfil(null); setDatos(null); return; }
    (async () => {
      const uid = sesion.user.id;
      const [{ data: cli }, { data: cats }, { data: prods }, { data: fots }, { data: docs }] = await Promise.all([
        supabase.from("clientes").select("*").eq("id", uid).single(),
        supabase.from("catalogos").select("*").order("orden", { ascending: true }),
        supabase.from("productos").select("*").order("nombre"),
        supabase.from("fotos").select("*").order("orden", { ascending: true }),
        supabase.from("documentos").select("*").order("orden", { ascending: true }),
      ]);
      setPerfil(cli || { id: uid, nombre: sesion.user.email, contacto: "", nivel: "Cliente" });
      setDatos({ catalogos: cats || [], productos: prods || [], fotos: fots || [], documentos: docs || [] });
    })();
  }, [sesion]);

  const mostrarAviso = (msg) => {
    setAviso(msg);
    setTimeout(() => setAviso(""), 4000);
  };

  if (sesion === undefined) return <div className="min-h-screen" style={{ background: S.paper }}><Cargando texto="Verificando sesión…" /></div>;
  if (!sesion) return <Login />;
  if (!perfil || !datos) return <div className="min-h-screen" style={{ background: S.paper }}><Cargando texto="Cargando tu portal…" /></div>;

  const numItems = Object.values(carrito).reduce((a, b) => a + b, 0);
  const tabs = [
    { id: "catalogos", nombre: "Catálogos", icono: BookOpen },
    { id: "fotos", nombre: "Fotos", icono: ImageIcon },
    { id: "documentos", nombre: "Documentos", icono: FileText },
    { id: "cotizacion", nombre: "Cotización", icono: ShoppingCart, badge: numItems },
  ];

  return (
    <div className="min-h-screen" style={{ background: S.paper, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <header style={{ background: S.brandDark }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Marca claro />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-white font-medium leading-tight" style={{ fontSize: 13 }}>{perfil.nombre}</div>
              <div className="leading-tight" style={{ fontSize: 11, color: "#ffffff99" }}>{perfil.nivel}</div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
              style={{ background: S.gold, color: S.ink, fontSize: 14 }}>
              {(perfil.nombre || "C").charAt(0).toUpperCase()}
            </div>
            <button onClick={() => supabase.auth.signOut()} title="Cerrar sesión"
              className="p-2 rounded-md hover:opacity-70"><LogOut size={17} color="#fff" /></button>
          </div>
        </div>
      </header>

      <div style={{ background: S.brand }}>
        <div className="max-w-5xl mx-auto px-4 py-5">
          <h1 className="text-white font-bold" style={{ fontSize: 24, fontFamily: "Georgia, serif" }}>
            Hola, {(perfil.contacto || perfil.nombre || "").split(" ")[0]}
          </h1>
          <p style={{ color: "#ffffffB3", fontSize: 13.5 }}>
            Este es el contenido disponible para {perfil.nombre} · Distribuidor autorizado Studmark
          </p>
        </div>
      </div>

      <nav className="bg-white" style={{ borderBottom: `1px solid ${S.line}` }}>
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3.5 py-3 font-medium whitespace-nowrap"
              style={{
                fontSize: 14,
                color: tab === t.id ? S.brand : "#6B7076",
                borderBottom: tab === t.id ? `2.5px solid ${S.brand}` : "2.5px solid transparent",
              }}>
              <t.icono size={15} /> {t.nombre}
              {t.badge > 0 && (
                <span className="rounded-full px-1.5 text-white font-bold"
                  style={{ background: S.gold, fontSize: 11, minWidth: 18, textAlign: "center" }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-16">
        {tab === "catalogos" && <Catalogos lista={datos.catalogos} onError={mostrarAviso} />}
        {tab === "fotos" && <Galeria lista={datos.fotos} />}
        {tab === "documentos" && <Documentos lista={datos.documentos} onError={mostrarAviso} />}
        {tab === "cotizacion" && (
          <Cotizacion productos={datos.productos} carrito={carrito} setCarrito={setCarrito}
            perfil={perfil} onError={mostrarAviso} />
        )}
      </main>

      {aviso && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg text-white shadow-lg"
          style={{ background: S.ink, fontSize: 13.5, maxWidth: "90vw" }}>
          {aviso}
        </div>
      )}
    </div>
  );
}
