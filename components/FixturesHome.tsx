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
    return JSON.parse(result).response;
  } catch (error) {
    console.error(error);
  }
};

export default async function FixturesHome() {
  console.log("Miramos los datos los partidos...");
  const fixtures = await fetchFixture(39);
  const game = fixtures.map((item: { fixture: any }) => item);
  const teams = game.map((item: { teams: any }) => item.teams);
  console.log(game)

  return (
    <div className="col-span-2 px-4">
      <h1 className="text-2xl font-bold mb-6">Partidos del dia</h1>
      {game.map(
        (fixture: {
          fixture: any;
          id: number;
          referee: string;
          date: any;
          teams: any;
        }) => (
          <div className="flex flex-col rounded-xl bg-white md:flex-row mb-4 w-full">
            <div className="flex flex-col justify-start p-6 w-full">
              <h5 className="mb-2 text-xl font-medium text-neutral-800">
                {fixture.fixture.date}
              </h5>
              <div className="flex flex-row justify-center items-center">
                <Image
                  src={fixture.teams.home.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.home.name}
                  className="mr-2"
                />
                <p className="font-bold md:text-xl">{fixture.teams.home.name}</p>
                 <p className="m-4 font-black">VS</p>
                <p className="font-bold md:text-xl">{fixture.teams.away.name}</p>
                <Image
                  src={fixture.teams.away.logo}
                  width={40}
                  height={40}
                  alt={fixture.teams.away.name}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
