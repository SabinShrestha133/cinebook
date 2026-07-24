import UserNavbar from "@/components/nav/UserNavbar";

export default function MoviesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            <UserNavbar />
            <main>{children}</main>
        </div>
    );
}