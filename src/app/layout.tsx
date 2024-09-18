"use client";

import { Inter } from "next/font/google";
import { usePathname, useSearchParams } from "next/navigation";
import Sidebar from "./sidebar";
import AdminHeader from "./admin/admin_header/adminHeader";
import "./globals.css";
import SignIn from "./signin/page";
import Sidebar2 from "./sidebar2";
import { Suspense } from "react"; // Import Suspense from React

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="layout-container">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchParamsWrapper>
              {(afterschool) => (
                <>
                  {(pathname === "/portalhome" || 
                  pathname === "/imagepuzzle" || pathname === "/arena/puzzleArena" || pathname === "/learnclass" || pathname === "/arena/startArena" || pathname === "/puzzles" || pathname === "/levels/level1" || pathname === "/levels/level2"
                    || pathname === "/levels/level3" || pathname === "/levels/level4" || pathname === "/chessPuzzle" || pathname === "/ChessPuzzle" || pathname === "/levels/level2test" || pathname === "/levels/level3test"
                    || pathname === "/levels/level4test" || pathname === "/tournaments" || pathname === "/tournamentRegistration" || pathname === "/arena/insidepuzzlearena" || pathname === "/learning" || pathname === "/Afterschool" || pathname === "/coaching") && <Sidebar />}
                  {(pathname === "/inprogress" || pathname === "/level1Modules/module1" || pathname === "/level1Modules/module2" || pathname === "/level1Modules/module3" || pathname === "/level1Modules/module4"
                   || pathname === "/level1Modules/module5" || 
                    (pathname === "/modules/level2/m1" && afterschool !== "true") ||
                    pathname === "/modules/level2/m2" ||
                    pathname === "/modules/level2/m3" ||
                    pathname === "/modules/level2/m4" ||
                    pathname === "/modules/level2/m5" ||
                    pathname === "/modules/level2/chessOpening/11"||pathname === "/modules/level2/chessOpening/12"||pathname === "/modules/level2/chessOpening/13" ||
                    pathname === "/modules/level2/tactics1/21"||pathname === "/modules/level2/tactics1/22"||pathname === "/modules/level2/tactics1/23" ||pathname === "/modules/level2/tactics1/24"||pathname === "/modules/level2/tactics1/25"||pathname === "/modules/level2/tactics1/26" ||
                    pathname === "/modules/level2/tactics2/31"||pathname === "/modules/level2/tactics2/32"||pathname === "/modules/level2/tactics2/33" ||pathname === "/modules/level2/tactics2/34"||pathname === "/modules/level2/tactics2/35"||pathname === "/modules/level2/tactics2/36" ||pathname === "/modules/level2/tactics2/37" ||
                    pathname === "/modules/level2/positionalCalculations/41"||pathname === "/modules/level2/positionalCalculations/42"||pathname === "/modules/level2/positionalCalculations/43" ||pathname === "/modules/level2/positionalCalculations/44"||
                     pathname === "/modules/level2/strategyAndPlanning/51"||pathname === "/modules/level2/strategyAndPlanning/52"||pathname === "/modules/level2/strategyAndPlanning/53"||
                     pathname === "/modules/level2/checkAndCheckmates/61"||pathname === "/modules/level2/checkAndCheckmates/62"||
                     pathname === "/modules/level2/checkmatePatterns/71"||pathname === "/modules/level2/checkmatePatterns/72"||pathname === "/modules/level2/checkmatePatterns/73" ||pathname === "/modules/level2/checkmatePatterns/74"||pathname === "/modules/level2/checkmatePatterns/75"||pathname === "/modules/level2/checkmatePatterns/76" ||pathname === "/modules/level2/checkmatePatterns/77"  ||pathname === "/modules/level2/checkmatePatterns/78" ||
                     pathname === "/modules/level2/gameAnalysis/81"||
                     pathname === "/modules/level2/chessStudyPlan/91"
                  ) && <Sidebar2 />}
                    
                  <div className="content-container">
                    {(pathname === "/admin" || pathname === "/admin/admin_upcoming_activities" || pathname === "/admin/admin_tournaments" || pathname === "/admin/admin_image_demo" || pathname === "/admin/StudentDetails") && <AdminHeader />}
                    {pathname === "/" ? <SignIn /> : <div className="scrollable-content">{children}</div>}
                  </div>
                </>
              )}
            </SearchParamsWrapper>
          </Suspense>
        </div>
      </body>
    </html>
  );
}

// Define the type for SearchParamsWrapper's props
interface SearchParamsWrapperProps {
  children: (afterschool: string | null) => React.ReactNode;
}

// SearchParamsWrapper Component
function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  const searchParams = useSearchParams();
  const afterschool = searchParams.get("afterschool");

  // Pass the afterschool value to the children function
  return <>{children(afterschool)}</>;
}
