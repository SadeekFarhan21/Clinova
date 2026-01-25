import { GlassNavbar } from "@/components/GlassNavbar";
import { GlassFooter } from "@/components/GlassFooter";

interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const MainLayout = ({ children, showFooter = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <GlassNavbar />
      <main className="flex-1 pt-16 pb-14">
        {children}
      </main>
      {showFooter && <GlassFooter />}
    </div>
  );
};
