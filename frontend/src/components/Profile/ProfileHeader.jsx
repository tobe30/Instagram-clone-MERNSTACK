import { Avatar, AvatarGroup, Button, Flex, Text, VStack, useDisclosure } from "@chakra-ui/react"
import EditProfile from "./EditProfile";
import useAuthUser from "../../hooks/useAuthUser";
import useFollow from "../../hooks/useFollow";

const ProfileHeader = ({username, bio, email, following, followers, posts, isLoading, profileUserId, profileimage}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: authUser } = useAuthUser();
      const { follow, isPending } = useFollow();
    

      

    const isMyProfile = authUser._id === profileUserId; // Check if the logged-in user is the same as the profile being viewed
    const amIFollowing = authUser?.following.includes(profileUserId);

    console.log("Posts from query:", posts);
    const handleFollow = async () => {
        if (amIFollowing) {
          await follow(profileUserId);  // This should handle the follow
        } else {
          await follow(profileUserId);  // This should handle unfollow
        }
    
        refetch(); // Refetch the user data after follow/unfollow action
      };
      // console.log("profileimage:", profileimage); testing purpose


  return <Flex gap={{base:4,sm:10}} py={10} direction={{base:"column",sm:"row"}}>
    <AvatarGroup
    size={{base:"xl",md:"2xl"}}
    justifySelf={"center"}
    alignSelf={"flex-start"}
    mx={"auto"}
    >

    <Avatar
  alt="As a Programmer"
  src={profileimage || "/default-avatar.png"}
  name="default"
/>

        
    </AvatarGroup>
    <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
     <Flex gap={4} direction={{base:"column",sm:"row"}}
     justifyContent={{base:"center",sm:"flex-start"}}
     alignItems={"center"}
     w={"full"}
     >
        <Text fontSize={{base:"sm",md:"lg"}}>
            {username}
        </Text>
        <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
        {isMyProfile && <Button bg={"white"} color={"black"} _hover={{bg:"whiteAlpha.800"}} onClick={onOpen} size={{base:"xs",md:"sm"}}>
                Edit Profile
            </Button>}

            {!isMyProfile && (
                <Button
                bg={amIFollowing ? "red.500" : "blue.500"} // Change color based on follow state
                color={"white"}
                _hover={{ bg: amIFollowing ? "red.600" : "blue.600" }}
                size={{ base: "xs", md: "sm" }}
                onClick={handleFollow}
               
              >
                {amIFollowing ? "Unfollow" : "Follow"}
              </Button>
                )}

        </Flex>
     </Flex>

     <Flex alignItems={"center"} gap={{base:2,sm:4}}>
        <Text fontSize={{base:"xs",md:"sm"}}>
            <Text as={"span"} fontWeight={"bold"} mr={1}>{posts.length}</Text>
            Posts
        </Text>

        <Text fontSize={{base:"xs",md:"sm"}}>
            <Text as={"span"} fontWeight={"bold"} mr={1}>{followers.length}</Text>
            Followers
        </Text>

        <Text fontSize={{base:"xs",md:"sm"}}>
            <Text as={"span"} fontWeight={"bold"} mr={1}>{following.length}</Text>
            Following
        </Text>
     </Flex>
     
     <Flex alignItems={"center"} gap={4}>
        <Text fontSize={"sm"} fontWeight={"bold"}>
            {email}
        </Text>
     </Flex>
     <Text fontSize={"sm"} >
           {bio}
        </Text>
    </VStack>
	{isOpen && <EditProfile authUser={authUser} isOpen={isOpen} onClose={onClose} />}

  </Flex>
}

export default ProfileHeader