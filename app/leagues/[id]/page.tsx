import Clasificacion from "@/components/Clasificacion"
import Standing from "@/components/Clasificacion"
import FixturesLeague from "@/components/FixturesLeague"
import NextGame from "@/components/NextGame";
import TopScorer from "@/components/TopScorer"
import Image from "next/image";
import React from "react"

interface LeagueInfos {
  logo: string;
  name: string;
  flag: string;
}
 
async function getData(params:any) {
  const url = `https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=${params}`
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cfd5812b6amsh90b6b90fa19242dp1b3342jsn56fae60f75b5",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
    next: { revalidate: 43200 }
  }
 
  const res = await fetch(url, options)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }
 
  return res.json()
}
 
export default async function Page( params:any ) {
  const data = await getData(params.params?.id)
 
  const leagueInfos = data?.response[0]?.league

  console.log(leagueInfos)

  const { logo, name, flag } = leagueInfos;
 
  return (
    <div className="container mx-auto">
      <section className="flex min-h-screen flex-col justify-between">
      <div className="flex space-x-4 space-y-6 mt-8">
          <Image
            height={100}
            width={100}
            className="h-24"
            src={logo}
            alt={name}
          />
          <h2 className="text-3xl font-bold leading-tight">{name}</h2>
          <Image
            height={30}
            width={30}
            className="h-7"
            src={flag}
            alt={name}
          />
        </div>
        <NextGame leagueId={leagueInfos.id} />
        <FixturesLeague leagueId={leagueInfos.id}/>
        <Clasificacion leagueInfos={leagueInfos} />
        <TopScorer leagueId={leagueInfos.id}/>
    </section>
    </div>

  )
}
