import Image from "next/image";
import Link from "next/link";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";

const fetchTopScores: any = async (params: any) => {

  console.log("paramns ->" + params);
  const url = `https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=${params}&season=2023`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cfd5812b6amsh90b6b90fa19242dp1b3342jsn56fae60f75b5",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
    next: { revalidate: 43200 }
  };
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result).response;
  } catch (error) {
    console.error(error);
  }
};

export default async function TopScorer({ leagueId }:any) {
  console.log("Miramos goleadores...");
  console.log(leagueId)
  const scores = await fetchTopScores(leagueId);
  // console.log(scores)
  const topscores = scores.map((item: { score: any }) => item).slice(0,6);
  console.log(topscores)

  return (
    <div className="mt-10 bg-gray-900 rounded-xl p-4 w-full md:w-2/6">
      
      <h2 className="text-2xl font-bold mb-6">Goleadores</h2>
      {topscores.map(
        (score: {
          player: any;
          statistics:any;
        }, index:any) => (
          <div
          key={score.player.id}
          className={`flex flex-col rounded-xl bg-gray-800 md:flex-row mb-4 w-full ${index === 0 ? "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" : "" }`}
        >
            <div className="flex flex-col justify-start p-6 w-full">
              <div className="flex flex-row justify-center items-center">
                <Image
                  src={score.player.photo}
                  width={40}
                  height={40}
                  alt={score.player.photo}
                  className="mr-2  rounded-full"
                />
                <p className="font-bold md:text-sm">
                  {score.player.name}
                </p>
                <div className="bg-gray-900 flex p-2 m-1 rounded-xl">
                  <p className="text.bold">{score.statistics[0].goals.total} Goles</p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
