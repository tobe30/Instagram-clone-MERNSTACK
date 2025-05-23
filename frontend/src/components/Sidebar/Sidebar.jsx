import { Avatar, Box, Flex, Link, Tooltip } from "@chakra-ui/react";
import {Link as RouterLink} from "react-router-dom";
import { CreatePostLogo, InstagramLogo, InstagramMobileLogo, NotificationsLogo, SearchLogo } from "../../assets/constants";
import { AiFillHome } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SidebarItems from "./SidebarItems";

const Sidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const {mutate: logout} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        })
        const data = await res.json();
        if(!res.ok) {
          throw new Error(data.error || "Failed to logout")
        }

      } catch (error) {
        throw new Error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"]});
    },
    onError:() => {
			toast.error("logout failed")
		}
  });

  const handleLogout = (e) => {
    e.preventDefault();
    logout(null, {
      onSuccess: () => {
       
      },
    });
  };


  return (
    <Box
    height={"100vh"}
    borderRight={"1px solid"}
    borderColor={"whiteAlpha.300"}
    py={8}
    position={"sticky"}
    top={0}
    left={0}
    px={{base:2,md:4}}
    >

   <Flex direction={"column"} gap={10} w="full" height={"full"}>
    <Link to={"/"} as={RouterLink} pl={2} display={{base: "none",md:"block"}} cursor="pointer">
    <InstagramLogo/>

    </Link>

    <Link to={"/"} as={RouterLink} p={2} display={{base: "block",md:"none"}} borderRadius={6} _hover={{
      bg:"whiteAlpha.200"
    }}
    w={10}
    cursor="pointer">
    <InstagramMobileLogo/>

    </Link>
    <Flex direction={"column"} gap={5} cursor={"pointer"}>
    <SidebarItems />
    </Flex>
    <Tooltip 
        hasArrow
        label={"Logout"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{base:"block",md:'none'}}
        >
          <Link
          display={"flex"}
          alignContent={"center"}
          gap={4}
          _hover={{bg:"whiteAlpha.400"}}
          borderRadius={6}
          p={2}
          w={{base: 10, md: "full"}}
          mt={"auto"}
          justifyContent={{base: "center", md: "flex-start"}}
          onClick={handleLogout}
          >
           <BiLogOut size={25}/>
            <Box display={{base:"none",md:"block"}} 
           
            >
              Logout
            </Box>
          </Link>
        </Tooltip>
    </Flex>   
    </Box>
  )
}

export default Sidebar