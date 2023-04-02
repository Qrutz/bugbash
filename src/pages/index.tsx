import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="container mx-auto h-screen  bg-slate-800">
      <main className="flex flex-col items-center justify-center ">main</main>
    </div>
  );
};

export default Home;
