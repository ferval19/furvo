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
  // Obtén la fecha actual
  const fechaActual = new Date();

  // Obtiene el año, mes y día
  const año = fechaActual.getFullYear();
  // El mes se indexa desde 0, así que sumamos 1 para obtener el mes actual.
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaActual.getDate()).padStart(2, "0");

  // Crea la cadena en formato "año-mes-día"
  const fechaEnFormatoAñoMesDia = `${año}-${mes}-${dia}`;
  console.log(fechaEnFormatoAñoMesDia);
  console.log("paramns ->" + params);
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&league=${params}`;
  // const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&league=308`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cfd5812b6amsh90b6b90fa19242dp1b3342jsn56fae60f75b5",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
    next: { revalidate: 300 },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result).response;
  } catch (error) {
    console.error(error);
  }
};

export default async function FixturesLive({ leagueId }: any) {
  console.log("Partido en directo...");
  const fixtures = await fetchFixture(leagueId);
  const game = fixtures.map((item: { fixture: any }) => item).slice(0, 5);
  const teams = game.map((item: { teams: any }) => item.teams);
  console.log(game.length);

  if (game.length === 0) {
    return <></>;
  }

  return (
    <div className="p-4 mt-4 bg-gray-900 rounded-xl w-full col-span-1">
      <h2 className="text-2xl mb-6 ">
        <span className="text-red-600 border-2 border-rose-500 p-2 rounded-lg bg-rose-300">
          Directo
        </span>
      </h2>
      <div className="overflow-x-auto w-full">
        <div className="flex space-x-4">
          {game.map(
            (
              fixture: {
                fixture: any;
                id: number;
                referee: string;
                date: any;
                teams: any;
                score: any;
                goals: any;
              },
              index: any
            ) => (
              <div
                key={fixture.fixture.id}
                className={`flex flex-col rounded-xl bg-gray-800 md:flex-row w-full px-8`}
              >
                <div className="flex flex-col justify-start p-6 w-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-xs font-bold text-green-600">
                      {fixture.fixture.status.elapsed} "
                    </p>
                  </div>
                  <div className="flex flex-row justify-center items-center">
                    <Image
                      src={fixture.teams.home.logo}
                      width={40}
                      height={40}
                      alt={fixture.teams.home.name}
                      className="mr-2"
                    />
                    <p className="font-bold md:text-sm">
                      {fixture.teams.home.name}
                    </p>
                    <div className="bg-gray-900 flex p-2 m-1 rounded-xl">
                      <p className="text.bold">{fixture.goals.home}</p>
                      <span className="mx-1">:</span>
                      <p className="text.bold"> {fixture.goals.away}</p>
                    </div>
                    <p className="font-bold md:text-sm">
                      {fixture.teams.away.name}
                    </p>
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
      </div>
    </div>
  );
}
