import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { BsBookmark, BsGrid3X3, BsSuitHeart } from 'react-icons/bs'

const ProfileTabs = ({ feedType, setFeedType }) => {

  // Handle tab click
  const handleTabClick = (type) => {
    setFeedType(type);
  };

  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      gap={{ base: 4, sm: 10 }}
      textTransform={"uppercase"}
      fontWeight={"bold"}
    >
      <Flex
        alignItems={"center"}
        p="3"
        gap={1}
        cursor={"pointer"}
        onClick={() => handleTabClick("posts")}
        // Apply an active style based on the selected feedType
        borderTop={feedType === "posts" ? "1px solid #fff" : "none"}
      >
        <Box fontSize={20}>
          <BsGrid3X3 />
        </Box>
        <Text fontSize={12} display={{ base: "none", sm: "block" }}>Posts</Text>
      </Flex>

      <Flex
        alignItems={"center"}
        p="3"
        gap={1}
        cursor={"pointer"}
        onClick={() => handleTabClick("likes")}
        // Apply an active style based on the selected feedType
        borderTop={feedType === "likes" ? "2px solid #fff" : "none"}
      >
        <Box fontSize={20}>
          <BsSuitHeart fontWeight={"bold"} />
        </Box>
        <Text fontSize={12} display={{ base: "none", sm: "block" }}>Likes</Text>
      </Flex>
    </Flex>
  );
};

export default ProfileTabs;
