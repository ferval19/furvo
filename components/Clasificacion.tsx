import Image from "next/image"
import React from "react"
 
function Clasificacion({ leagueInfos }:any) {
  const data = [
    "Ranking",
    "Team",
    "GP",
    "W",
    "D",
    "L",
    "GD",
    "PTS",
  ]
 
  const filteredData = data.map((title, index) => (
    <th
      key={index}
      className="border-red-20 w-auto border-b-2 bg-green-200 px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600 "
    >
      {title}
    </th>
  ))
 
  const clubs = leagueInfos.standings[0].map((club:any) => (
    <tr key={club.rank}>
      <td className="w-32 border-b border-gray-200 bg-white px-2 py-2 text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 ">
            <p>{club.rank}</p>
          </div>
        </div>
      </td>
      <td className="w-36 border-b border-gray-200 bg-white px-2 py-2 text-sm">
        <Image
          width={40}
          height={40}
          className="h-10  w-10 rounded-full"
          src={club.team.logo}
          alt=""
        />
      </td>
      <td className="w-36 border-b border-gray-200 bg-white px-2 py-2 text-sm">
        <a href="#">{club.team.name}</a>
      </td>
      <td className="w-10 border-b border-gray-200 bg-white px-2 py-2 text-sm">
        {club.all.played}
      </td>
      <td className="w-10 border-b border-gray-200 bg-white px-2 py-2 text-sm">
        {club.all.win}
      </td>
      <td className="w-10 border-b border-gray-200 bg-white px-2 py-2 text-sm">
        {club.all.draw}
      </td>
      <td className="w-10 border-b border-gray-200 bg-white px-2 py-2 text-sm">
        {club.all.lose}
      </td>
      <td className="w-10 border-b border-gray-200 bg-white px-2 py-2 text-sm">
        {club.goalsDiff}
      </td>
      <td className="w-10 border-b border-gray-200 bg-white px-2 py-2 text-sm font-semibold">
        {club.points}
      </td>
    </tr>
  ))
 
  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex space-x-4 space-y-6">
          <Image
            height={100}
            width={100}
            className=" h-24"
            src={leagueInfos.logo}
            alt={leagueInfos.name}
          />
          <h2 className="text-3xl font-bold leading-tight">
            {leagueInfos.name}
          </h2>
          <Image
            height={30}
            width={30}
            className=" h-7"
            src={leagueInfos.flag}
            alt={leagueInfos.name}
          />
        </div>
        <div className="-mx-4 w-full overflow-x-scroll px-4 py-4 sm:-mx-8 sm:px-8 xl:overflow-x-hidden">
          <div className="inline-block min-w-full rounded-lg shadow ">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>{filteredData}</tr>
              </thead>
              <tbody>{clubs}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default Clasificacion