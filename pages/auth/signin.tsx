import { getProviders, getSession } from "next-auth/react";
import Login from "../../components/Login";
import { Provider } from "next-auth/providers";

export async function getServerSideProps(req) {
  const session = await getSession(req);

  if (session) {
    return { redirect: { destination: "/taskList" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

type Input = {
  providers: Provider[];
};

export default function SignIn({ providers }: Input) {
  return (
    <div className="page">
      <main className="h-screen flex justify-center items-center">
        <Login providers={providers} />
      </main>
    </div>
  );
}
