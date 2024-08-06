import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="flex justify-center py-24">
      <SignIn />
    </div>
  );
};

export default Page;
