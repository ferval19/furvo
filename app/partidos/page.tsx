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

const fetchFixture: any = async (params: any) => {
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=2023-09-02&league=39&season=2023`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cfd5812b6amsh90b6b90fa19242dp1b3342jsn56fae60f75b5",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log("Obtenemos los datos de los partidos....");
    // console.log(JSON.parse(result).response.map(item => item.team))
    return JSON.parse(result).response;
  } catch (error) {
    console.error(error);
  }
};

export default async function Page(params: any) {
  console.log("Miramos los datos los partidos...");
  console.log(params.params.id);
  const fixtures = await fetchFixture(39);
  console.log(fixtures);
  const game = fixtures.map((item: { fixture: any }) => item);
  const teams = game.map((item: { teams: any }) => item.teams);

  console.log(game);
  console.log(teams);

  return (
    <div>
      <h1 className="text-2xl">Partidos del dia</h1>
      {game.map(
        (fixture: {
          fixture: any;
          id: number;
          referee: string;
          date: any;
          teams: any;
        }) => (
          <div className="flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:max-w-xl md:flex-row">
            <div className="flex flex-col justify-start p-6">
              <h5 className="mb-2 text-xl font-medium text-neutral-800">
                {fixture.fixture.date}
              </h5>
              <p className="mb-4 text-base text-neutral-600 ">
                Referee: {fixture.fixture.referee}
              </p>
              <Image
                src={fixture.teams.home.logo}
                width={40}
                height={40}
                alt={fixture.teams.home.name}
              />
              {fixture.teams.home.name} VS
              <Image
                src={fixture.teams.away.logo}
                width={40}
                height={40}
                alt={fixture.teams.away.name}
              />
              {fixture.teams.away.name}
            </div>
          </div>
        )
      )}
    </div>
  );
}
