"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ListLeaguesPage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getLeagues = async () => {
      let { data: leagues, error } = await supabase.from("leagues").select("*");
      if (leagues) {
        setLeagues(leagues);
      }
    };
    getLeagues();
  }, [supabase, setLeagues]);

  return (
    <section className="col-span-2 px-6 py-4 mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nuestras ligas</h2>
      <div className="flex flex-col">
        {leagues.map(({ id, name, slug, api_id, logo }) => (
              <Link
                className="flex flex-row items-center text-xl font-normal text-white mb-4"
                href={`/leagues/${api_id}`}
                key={id}
              >
                <Image
                src={logo}
                width={40}
                height={40}
                alt={name}
                className="mr-4"
              />
                {name}
              </Link>
        ))}
      </div>
    </section>
  );
}
