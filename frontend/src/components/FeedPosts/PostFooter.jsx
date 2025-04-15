import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { CommentLogo, NotificationsLogo, UnlikeLogo } from "../../assets/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../../hooks/useAuthUser";
import CommentsModal from "../Modals/CommentsModal";


const PostFooter = ({post,isProfilePage}) => {
  // const [liked, setLiked] = useState(false)
  // const [likes, setLikes] = useState(1000);
  const { data: authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // update cache
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    
      queryClient.setQueryData(["userProfile", post.username], (oldData) => {
        if (!oldData || !oldData.posts) return oldData;
    
        const updatedPosts = oldData.posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
    
        return { ...oldData, posts: updatedPosts };
      });
    
      // 🔁 force a refetch so components using useQuery get fresh data
      queryClient.invalidateQueries(["userProfile", post.username]);
    },
    
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  }

  return <Box my={10} marginTop={"auto"}>
    
    <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={1} mt={4}>
      <Box onClick={handleLikePost} cursor={"pointer"} fontSize={18}>
          {!isLiked ? (<NotificationsLogo/>) : (<UnlikeLogo/>)}
      </Box>

      <Box cursor={"pointer"} fontSize={18}>
        <CommentLogo />
      </Box>
    </Flex>

    <Text fontWeight={600} fontSize={"sm"}>
    {post.likes.length}
    </Text>

    {!isProfilePage && (
      <>
      <Text fontSize='sm' fontWeight={700}>
      {post.username}
        <Text as='span' fontWeight={400}>
          {post.text}
        </Text>
    </Text>
    <Text fontSize='sm' color={"gray"} cursor={"pointer"} onClick={onOpen}>
    View all {post.comments.length} comment{post.comments.length !== 1 && "s"}
    </Text>
    					{/* COMMENTS MODAL ONLY IN THE HOME PAGE */}
              {isOpen ? <CommentsModal isOpen={isOpen} onClose={onClose} post={post} /> : null}
      </>
    )}

    <Flex
    alignItems={"center"}
    gap={2}
    justifyContent={"space-between"}
    w={"full"}
    >
    <InputGroup>
    {/* <Input variant={"flushed"} placeholder={"Add a comment..."} fontSize={14}/> */}
    <InputRightElement>
     <Button
     fontSize={14}
     color={"blue.500"}
     fontWeight={600}
     cursor={"pointer"}
     _hover={{color:"white"}}
     bg={"transparent"}
     >
      </Button>
    </InputRightElement>
    </InputGroup>

    </Flex>
    </Box>
  
}

export default PostFooter