import { currentUser } from "@clerk/nextjs/server";
import { getXataClient } from "@/database/xata";
import ProfileContainer from "@/components/ProfileContainer";

const ProfilePage = async () => {

  const user = await currentUser();
  const xataClient = getXataClient();

  if (!user) {
    throw new Error("User not found");
  }

  let challengePreferences = await xataClient.db.challengePreferences.filter({ userId: user?.id }).getFirst();

  if (!challengePreferences) {
    challengePreferences = await xataClient.db.challengePreferences.create({
      userId: user?.id,
      challengeId: "EASY",
      sendNotifications: true,
    });

  }
  const serializedChallengePreferences = challengePreferences.toSerializable();
  console.log(serializedChallengePreferences);

  return (
    <div className="max-w-screen-lg m-10 lg:mx-auto">
      <ProfileContainer
        challengePreferences={serializedChallengePreferences}
      />
    </div>
  );
};

export default ProfilePage;
