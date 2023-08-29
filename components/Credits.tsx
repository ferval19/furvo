import Link from "next/link";
import NextJsLogo from "./NextJsLogo";
import SupabaseLogo from "./SupabaseLogo";

export default function Credits() {
    return (
        <div className="flex flex-col items-center mb-4 lg:mb-12">
          <div className="flex gap-8 justify-center items-center">
            <Link href="https://supabase.com/" target="_blank">
              <SupabaseLogo />
            </Link>
            <span className="border-l rotate-45 h-6" />
            <NextJsLogo />
          </div>
          <div className="flex justify-center text-center text-xs">
            <p>
              Powered by{" "}
              <Link
                href="https://supabase.com/"
                target="_blank"
                className="font-bold"
              >
                ferval19
              </Link>
            </p>
          </div>
        </div>
    )
  }
  