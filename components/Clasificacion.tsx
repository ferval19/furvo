import Image from "next/image";
import React from "react";

interface Club {
  rank: number;
  team: {
    logo: string;
    name: string;
    id: string; // Reemplaza con el tipo de ID correcto
  };
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
  };
  goalsDiff: number;
  points: number;
}

interface LeagueInfos {
  logo: string;
  name: string;
  flag: string;
  standings: Club[][];
}

function TableRow({ club, index }: { club: Club; index: number }) {
  // Determinar el color de fondo alternante
  const backgroundColor = index % 2 === 0 ? "bg-gray-900 text-white" : "bg-gray-800 text-white";

  return (
    <tr className={backgroundColor}>
      <td className="w-32  px-2 py-2 text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <p>{club.rank}</p>
          </div>
        </div>
      </td>
      <td className="w-36 px-2 py-2 text-sm">
        <div className="flex flex-wrap items-center">
                  <Image
          width={40}
          height={40}
          className="h-10 w-10 mr-2"
          src={club.team.logo}
          alt={`${club.team.name} Logo`}
        />
        <a href={`/club/${club.team.id}`}>{club.team.name}</a>
        </div>

      </td>
      <td className="w-10 px-2 py-2 text-sm">
        {club.all.played}
      </td>
      <td className="w-10 px-2 py-2 text-sm">
        {club.all.win}
      </td>
      <td className="w-10 px-2 py-2 text-sm">
        {club.all.draw}
      </td>
      <td className="w-10 px-2 py-2 text-sm">
        {club.all.lose}
      </td>
      <td className="w-10 px-2 py-2 text-sm">
        {club.goalsDiff}
      </td>
      <td className="w-10 px-2 py-2 text-sm font-semibold">{club.points}</td>
    </tr>
  );
}

function Clasificacion({ leagueInfos }: { leagueInfos: LeagueInfos | null }) {
  if (!leagueInfos) {
    return <p>Cargando...</p>;
  }

  const { logo, name, flag, standings } = leagueInfos;
  const dataHeaders = [
    "#",
    "Club",
    "Jugados",
    "G",
    "E",
    "P",
    "GD",
    "PTS",
  ];

  const tableHeaders = dataHeaders.map((title, index) => (
    <th
      key={index}
      className="border-red-20 w-auto border-b-2 bg-gray-950 px-5 py-3 text-left text-xs font-semibold uppercase text-white"
    >
      {title}
    </th>
  ));

  return (
    <div className="p-4 mt-10 bg-gray-900 rounded-xl w-full md:w-4/6">
      
    <h2 className="text-2xl font-bold mb-6">Clasificacion</h2>
        <div className={`-mx-4 w-full overflow-x-scroll px-4 py-4 sm:-mx-8 sm:px-8 xl:overflow-x-hidden`}>
          <div className={`inline-block min-w-full rounded-lg shadow`}>
            <table className="min-w-full leading-normal text-black">
              <thead>
                <tr>{tableHeaders}</tr>
              </thead>
              <tbody>
                {standings[0].map((club, index) => (
                  <TableRow key={club.rank} club={club} index={index} />
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}

export default Clasificacion;
