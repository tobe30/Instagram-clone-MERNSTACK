import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { Link } from "react-router-dom";

const SuggestedUser = ({userId, followers, name, profileImg, onFollow, isLoading}) => {
    const [isFollowed, setIsFollowed] = useState(false)

    const handleFollow = () => {
        setIsFollowed((prev) => !prev);
        onFollow(userId); // trigger mutation
      };

  return <Flex justifyContent={"space-between"} align={"center"} w={"full"}>

    <Flex alignItems={"center"} gap={2}>
    <Link to={`/profile/${name}`}>
        <Avatar src={profileImg} name={name} size={"md"}/>
        </Link>
        

        <VStack spacing={2} alignItems={"flex-start"}>
        <Link to={`/profile/${name}`}>
            <Box fontSize={12} fontWeight={"bold"}>
                {name}
            </Box>
            </Link>
            <Box fontSize={11} fontWeight={"bold"} color={"gray.500"}>
                {followers.length} followers
            </Box>
        </VStack>
    </Flex>
    <Button
    fontSize={13}
    bg={"transparent"}
    p={0}
    h={"max-content"}
    fontWeight={"medium"}
    color={"blue.400"}
    cursor={"pointer"}
    _hover={{color:"white"}}
    onClick={handleFollow}
    isLoading={isLoading}
    >
        {isFollowed ? "unfollow": "follow"}
    </Button>
  </Flex>
}

export default SuggestedUser