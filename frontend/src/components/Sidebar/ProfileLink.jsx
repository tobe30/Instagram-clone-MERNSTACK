import { Avatar, Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthUser";

const ProfileLink = () => {
  const { data: authUser, error } = useAuthUser();

  // Add loading and error state handling
  if (error) {
    return <div>Error loading profile</div>; // Handle the error case
  }

  if (!authUser) {
    return <div>Loading...</div>; // Show loading indicator if user data is not available
  }

  return (
    <Tooltip
      hasArrow
      label={"Profile"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display={"flex"}
        to={`/profile/${authUser.username}`}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <Avatar size={"sm"} src={authUser.profileImg || "/default-avatar.png"} /> {/* Fallback for profile image */}
        <Box display={{ base: "none", md: "block" }}>Profile</Box>
      </Link>
    </Tooltip>
  );
};

export default ProfileLink;
