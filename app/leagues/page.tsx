import CarruselLeaguesPage from "@/components/CarruselLeagues";

export default function LeaguesPage() {
  return (
    <div className="container mx-auto">
      <section className="flex min-h-screen flex-col">
        <h1 className="text-3xl mt-8 px-6">Las ligas mas importantes de europa</h1>
        <CarruselLeaguesPage></CarruselLeaguesPage>
      </section>
    </div>
  );
}
