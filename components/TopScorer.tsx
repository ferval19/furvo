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
    next: { revalidate: 43200 },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result).response;
  } catch (error) {
    console.error(error);
  }
};

export default async function TopScorer({ leagueId }: any) {
  console.log("Miramos goleadores...");
  console.log(leagueId);
  const scores = await fetchTopScores(leagueId);
  // console.log(scores)
  const topscores = scores.map((item: { score: any }) => item).slice(0, 6);
  console.log(topscores);

  return (
    <div className="mt-4 bg-gray-900 rounded-xl p-4 w-full">
      <h2 className="text-2xl font-bold mb-6">Goleadores</h2>
      {topscores.map(
        (
          score: {
            player: any;
            statistics: any;
          },
          index: any
        ) => (
          <div
            key={score.player.id}
            className={`flex flex-col rounded-xl bg-gray-800 md:flex-row mb-4 w-full ${
              index === 0
                ? "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
                : ""
            }`}
          >
          {index === 0 ? (
            // Renderizar este div solo para el primer elemento
            <div className="flex items-center justify-between px-4 pt-4 w-full">
              <div className="flex items-center mr-4">
                <Image
                  src={score.player.photo}
                  width={90}
                  height={90}
                  alt={score.player.name}
                  className="mr-2 filter-brightness mix-blend-multiply"
                />
                              <div className="">
              <p className="font-bold md:text-xl">{score.player.name}</p>
                <p className="font-bold md:text-normal">{score.statistics[0].goals.total} Goles</p>
              </div>
              </div>

              <Image
                  src={score.statistics[0].team.logo}
                  width={50}
                  height={50}
                  alt={score.player.name}
                  className="mr-2"
                />
            </div>
          ) : (
            // Renderizar este div para los elementos restantes
            <div className="flex items-center justify-between p-4 w-full">
              <div className="flex items-center">
                <Image
                  src={score.player.photo}
                  width={40}
                  height={40}
                  alt={score.player.name}
                  className="mr-2 rounded-full "
                />
                <p className="font-bold md:text-sm">{score.player.name}</p>
              </div>
                <p className="text-bold">{score.statistics[0].goals.total} Goles</p>
            </div>
          )}
          </div>
        )
      )}
    </div>
  );
}
