import { Box, Flex, Text, VStack, Spinner } from "@chakra-ui/react";
import SuggestedHeader from "./SuggestedHeader";
import SuggestedUser from "./SuggestedUser";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";

const SuggestedUsers = () => {
  const { data: suggestedUsers, isLoading, isError, error } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });
  const { follow, isPending } = useFollow();


  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" py={8}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Box py={8} px={6} color="red.500">
        <Text>Error loading suggested users: {error.message}</Text>
      </Box>
    );
  }


  return (
    <VStack py={8} px={6} gap={4}>
      <SuggestedHeader />
      <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
        <Text fontSize={12} fontWeight={"bold"} color={"gray.500"}></Text>
        <Text
          fontSize={12}
          fontWeight={"bold"}
          _hover={{ color: "gray.400" }}
          cursor={"pointer"}
        >
      
        </Text>
      </Flex>

      {/* Map over the suggested users */}
      {suggestedUsers?.map((user) => (
        <SuggestedUser
          key={user._id} // Ensure there's a unique key for each user
          userId={user._id}
          name={user.username}
          followers={user.followers}
          onFollow={follow}
          profileImg={user.profileImg}
          isLoading={isPending}
        />
      ))}

      <Box fontSize={12} color={"gray.500"} mt={5} alignSelf={"start"}>
        @2023 Built By marizu
      </Box>
    </VStack>
  );
};

export default SuggestedUsers;
