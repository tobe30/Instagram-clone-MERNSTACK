import { Box, Grid, Skeleton, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProfilePost from "./ProfilePost";

const ProfilePosts = ({ posts, isLoading }) => {
  return (
    <Grid
      templateColumns={{
        sm: "repeat(1, 1fr)",
        md: "repeat(3, 1fr)",
      }}
      gap={1}
      columnGap={1}
    >
      {/* Show skeleton loader while loading */}
      {isLoading && [0, 1, 2, 3, 4, 5].map((_, idx) => (
        <VStack key={idx} alignItems={"flex-start"} gap={4}>
          <Skeleton w={"full"}>
            <Box h="300px">contents wrapped</Box>
          </Skeleton>
        </VStack>
      ))}

      {/* Show posts when not loading */}
      {!isLoading && posts?.length > 0 && posts.map((post, idx) => (
        <ProfilePost posts={post} key={idx} img={post.img} />
      ))}

      {/* Optional: Show a message if no posts are found */}
      {!isLoading && posts?.length === 0 && (
        <VStack>
          <Box>No posts available</Box>
        </VStack>
      )}
    </Grid>
  );
};

export default ProfilePosts;
