import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { getServerSession } from "next-auth";

const Home: NextPage = () => {
  const { data: session, status: userstatus } = useSession();

  const { data: workspacedata, status } = api.example.getWorkspace.useQuery({
    teamI: "clfzg2vx600029y9v4qyhcx52",
  });

  console.log(workspacedata);

  if (userstatus === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn()}>SIGN IN </button>
      </div>
    );
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto h-screen  bg-slate-800">
      <main className="flex flex-col items-center justify-center ">
        <h1>Welcome {session.user.name}</h1>
        {workspacedata?.map((workspace) => (
          <div key={workspace.id}>
            <Link href={`/workspace/${workspace.id}`}>{workspace.name}</Link>
          </div>
        ))}

        <button onClick={() => signOut()}>Sign out</button>
      </main>
    </div>
  );
};

export default Home;
