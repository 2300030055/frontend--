import { Sidebar, MobileNav } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-bg min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="min-h-screen px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
