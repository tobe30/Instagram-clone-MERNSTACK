import { Avatar, Flex, Link, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";

const SuggestedHeader = () => {
  const { data: authUser, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch user");
      }
      return data;
    },
  });

  if (isLoading) {
    return <Text fontSize={12}>Loading user...</Text>;
  }

  if (isError || !authUser) {
    return <Text fontSize={12} color="red.400">Error loading user</Text>;
  }

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
      <Flex alignItems={"center"} gap={2}>
        <Avatar name={authUser.username} size={"lg"} src={authUser.profileImg || "/profilepic.png"} />
        <Text fontSize={12} fontWeight={"bold"}>
          {authUser.username}
        </Text>
      </Flex>
      {/* <Link
        as={RouterLink}
        to={"/auth"}
        fontSize={14}
        fontWeight={"medium"}
        color={"blue.400"}
        style={{ textDecoration: "none" }}
        cursor={"pointer"}
      >
        Log out
      </Link> */}
    </Flex>
  );
};

export default SuggestedHeader;
