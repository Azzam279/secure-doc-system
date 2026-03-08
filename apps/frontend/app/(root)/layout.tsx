import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex flex-col flex-1">
          <Navbar />

          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
