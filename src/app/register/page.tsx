import Link from "next/link";
import { registerAction } from "@/app/actions";

export default async function RegisterPage({
  searchParams,
}: PageProps<"/register">) {
  const { error } = await searchParams;
  return (
    <main className="form-wrap">
      <form className="form-panel" action={registerAction}>
        <p className="eyebrow">BIENVENIDA, BIENVENIDO</p>
        <h1>
          Hagamos
          <br />
          buenas migas.
        </h1>
        <p>Crea tu cuenta para completar pedidos y seguir tus compras.</p>
        {error && (
          <p className="form-error" role="alert">
            No pudimos crear tu cuenta. Revisa los datos o prueba con otro
            correo.
          </p>
        )}
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
          />
        </div>
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
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password_confirmation">Confirmar contraseña</label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <button className="button button-dark" type="submit">
          Crear cuenta <span>↗</span>
        </button>
        <p className="form-switch">
          ¿Ya tienes cuenta? <Link href="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
