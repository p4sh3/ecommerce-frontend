import Link from "next/link";
import { loginAction } from "@/app/actions";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  return (
    <main className="form-wrap">
      <form className="form-panel" action={loginAction}>
        <p className="eyebrow">QUÉ BUENO VERTE</p>
        <h1>
          Entrar a<br />
          mi cuenta.
        </h1>
        <p>Continúa tu compra y encuentra tus pedidos en un solo lugar.</p>
        {error && (
          <p className="form-error" role="alert">
            {error === "credentials"
              ? "No pudimos iniciar sesión. Revisa tu correo y contraseña."
              : "Ocurrió un problema. Inténtalo de nuevo."}
          </p>
        )}
        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button className="button button-dark" type="submit">
          Entrar <span>↗</span>
        </button>
        <p className="form-switch">
          ¿Aún no tienes cuenta? <Link href="/register">Crear cuenta</Link>
        </p>
      </form>
    </main>
  );
}
