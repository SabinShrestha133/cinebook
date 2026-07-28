import UserNavbar from "@/components/nav/UserNavbar";

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <UserNavbar />
            <main>{children}</main>
        </div>
    );
}