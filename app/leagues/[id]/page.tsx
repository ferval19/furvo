import Clasificacion from "@/components/Clasificacion"
import Standing from "@/components/Clasificacion"
import FixturesLeague from "@/components/FixturesLeague"
import TopScorer from "@/components/TopScorer"
import React from "react"
 
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
 
  return (
    <section className="flex min-h-screen flex-col items-center justify-between">
      <FixturesLeague />

      <Clasificacion leagueInfos={leagueInfos} />
      <TopScorer />
    </section>
  )
}
