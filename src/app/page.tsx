import Link from "next/link";
import css from "@/styles/auth-home.module.scss";

export default function Home() {
  return (
    <>
      <div className={css.auth}>
        <span>
          You will be redirected to the login page in a few seconds, if you
          aren't redirected please, click the link below:
        </span>
        <Link href="/login" replace>
          Redirect!
        </Link>
      </div>
    </>
  );
}
