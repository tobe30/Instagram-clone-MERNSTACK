import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import useFollow from "../../hooks/useFollow";
import React, { useState } from 'react'
import { Spinner } from '@chakra-ui/react';
import useAuthUser from "../../hooks/useAuthUser";



const PostHeader = ({post}) => {

   // Check if post and post.user exist before accessing them
   if (!post || !post.user) {
    return null; // or return some placeholder if you prefer
  }
  const { data: authUser } = useAuthUser();
  const postOwner = post.user;
  const isOwnPost = authUser?._id === postOwner._id;
  const [isFollowing, setIsFollowing] = useState(
    postOwner.followers?.includes(authUser._id) // you may adjust this logic
  );

  const { follow, isPending } = useFollow();

  const handleFollowToggle = () => {
    follow(postOwner._id, {
      onSuccess: () => {
        setIsFollowing((prev) => !prev);
      },
    });
  };
  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} my={2}>
      <Flex alignItems={"center"} gap={2}>
      <Avatar src={postOwner?.profileImg || "/default-avatar.png"} alt="user profile pic" size={"sm"} />

        <Flex fontSize={12} fontWeight={"bold"} gap="2">
          {postOwner.username}
          <Box color={"gray.500"}>
          • 1w
          </Box>
        </Flex>
      </Flex>
      {!isOwnPost && (
        <Box
          fontSize={12}
          color="blue.500"
          fontWeight="bold"
          _hover={{ color: "white" }}
          transition="0.2s ease-in-out"
          onClick={handleFollowToggle}
          cursor="pointer"
        >
          {isPending ? (
            <Spinner size="xs" />
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </Box>
      )}

    </Flex>
  )
}

export default PostHeader