import ResetPasswordForm from "../_components/PasswordResetForm";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const query = await searchParams;
    const { token } = query;
    return (
        <div>
            <ResetPasswordForm token={token as string} />
        </div>
    );
}