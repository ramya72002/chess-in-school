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
                    (pathname === "/modules/m1" && afterschool !== "true") ||
                    pathname === "/modules/m2" ||
                    pathname === "/modules/m3" ||
                    pathname === "/modules/m4" ||
                    pathname === "/modules/m5" ||
                    pathname === "/modules/chessOpening/11"
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
