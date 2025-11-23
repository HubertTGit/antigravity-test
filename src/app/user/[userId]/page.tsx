import { UserButton } from "@clerk/nextjs";

export default async function UserPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>
      <h1 className="text-4xl font-bold">User Profile</h1>
      <p className="text-xl">User ID: {userId}</p>
      <p className="text-muted-foreground">This page is public and shareable.</p>
    </div>
  );
}
