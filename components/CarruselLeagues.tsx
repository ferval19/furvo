"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CarruselLeaguesPage() {
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
    <section className="container px-6 py-4 mx-auto">
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {leagues.map(({ id, name, slug, api_id, logo }) => (
          <div
            className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm "
            key={id}
          >
            <div className="p-3 mr-4 text-white rounded-full">
              <Image
                className="w-6 h-12"
                src={logo}
                width={100}
                height={100}
                alt={name}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-900">{name}</p>
              <Link
                className="text-sm font-normal text-gray-800"
                href={`/leagues/${api_id}`}
              >
                Ver mas...
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
