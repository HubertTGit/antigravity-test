import { SignInForm } from "@/components/auth/sign-in-form";
import { JoinListForm } from "@/components/join-list-form";
import { AuthRedirect } from "@/components/auth/auth-redirect";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const error =
    typeof searchParams.error === "string" ? searchParams.error : undefined;

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 pb-20 sm:p-20">
      <AuthRedirect />
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Sign In Option */}
        <div className="bg-card flex flex-col gap-3 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Start a new Shopping List?</h2>
          <p className="text-muted-foreground text-sm">
            Sign in to create your personal Shopping List
          </p>
          <SignInForm />
        </div>

        {/* Existing User ID Option */}
        <JoinListForm error={error} />
      </div>
    </div>
  );
}
