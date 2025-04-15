import { Container, Flex } from "@chakra-ui/react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import ProfilePosts from "../../components/Profile/ProfilePosts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ProfilePage = () => {
  const [feedType, setFeedType] = useState("posts");
  const { username } = useParams();

  const { data: userprofile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    enabled: !!username, // Only fetch profile data when username is present
  });

  const userId = userprofile?._id;

  // Get the correct endpoint based on the feedType
  const getPostEndpoint = () => {
    if (!userId) return null; // Ensure userId is available before generating the endpoint

    switch (feedType) {
      case "posts":
        return `/api/post/user/${username}`;
      case "likes":
        return `/api/post/likes/${userId}`; // Assuming the user profile is required here
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts", POST_ENDPOINT],
    queryFn: async () => {
      if (!POST_ENDPOINT) return []; // Return empty array if endpoint is not ready

      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    enabled: !!userId, // Ensure the query is enabled only when userId is available
  });

  // Effect to refetch when feedType or username changes
  useEffect(() => {
    // React Query will automatically refetch based on `feedType` change
  }, [feedType, username, userId]);

  return (
    <Container maxW="container.lg" py={5}>
      <Flex
        py={10}
        px={4}
        pl={{ base: 4, md: 10 }}
        w={"full"}
        mx={"auto"}
        flexDirection={"column"}
      >
        {userprofile && (
          <ProfileHeader
            key={userprofile._id}
            isLoading={isProfileLoading}
            username={userprofile.username}
            email={userprofile.email}
            bio={userprofile.bio}
            following={userprofile.following}
            followers={userprofile.followers}
            posts={posts}
            profileimage={userprofile.profileImg}
            profileUserId={userprofile._id} // Pass the userId to ProfileHeader
          />
        )}
      </Flex>
      <Flex
        px={{ base: 2, sm: 4 }}
        maxW={"full"}
        mx={"auto"}
        borderTop={"1px solid"}
        borderColor={"whiteAlpha.300"}
        direction={"column"}
      >
        <ProfileTabs feedType={feedType} setFeedType={setFeedType} />
        <ProfilePosts posts={posts} isLoading={isPostsLoading} />
      </Flex>
    </Container>
  );
};

export default ProfilePage;
