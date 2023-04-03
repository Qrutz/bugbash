import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: session, status: userstatus } = useSession();

  const { data, status } = api.projectRouter.getProjects.useQuery({
    userId: session?.user.id as string,
  });

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

  return (
    <div className="container mx-auto h-screen  bg-slate-800">
      <main className="flex flex-col items-center justify-center ">
        <h1>Welcome {session.user.name}</h1>

        {data?.map((project): any => {
          return (
            <div key={project.id}>
              <Link href={`/projects/${project.id}`}>{project.name}</Link>
            </div>
          );
        })}

        <button onClick={() => signOut()}>Sign out</button>
      </main>
    </div>
  );
};

export default Home;
