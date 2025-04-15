import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import useAuthUser from "../../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const ProfilePost = ({ posts, img }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const numComments = posts?.comments?.length || 0;
  const numLikes = posts?.likes?.length || 0;
  const { data: authUser } = useAuthUser();
  const queryClient = useQueryClient();


  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/${posts._id}`, {
          method: "DELETE",
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
    onSuccess: () => {
      toast.success("Post deleted successfully");
      //Invalidate the query to refetch the post
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };
  

  return (
    <>
      <GridItem
        cursor={"pointer"}
        borderRadius={4}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"whiteAlpha.300"}
        position={"relative"}
        aspectRatio={1 / 1}
        onClick={onOpen}
      >
        <Flex
          opacity={0}
          _hover={{ opacity: 1 }}
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={"blackAlpha.700"}
          transition={"all 0.3s ease"}
          zIndex={1}
          justifyContent={"center"}
        >
          <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
            <Flex>
              <AiFillHeart size={20} />
              <Text fontWeight={"bold"} ml={2}>
                {numLikes}
              </Text>
            </Flex>
            <Flex>
              <FaComment size={20} />
              <Text fontWeight={"bold"} ml={2}>
                {numComments}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Image
          src={img}
          alt="profile post"
          w={"100%"}
          h={"100%"}
          objectFit={"cover"}
        />
      </GridItem>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered={true}
        size={{ base: "3xl", md: "5xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody bg={"black"} pb={5}>
            <Flex
              gap="4"
              w={{ base: "90%", sm: "70%", md: "full" }}
              mx={"auto"}
            >
              <Box
                borderRadius={4}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"whiteAlpha.300"}
                flex={1.5}
              >
                <Image src={img} alt="profile post" />
              </Box>
              <Flex
                flex={1}
                flexDir={"column"}
                px={10}
                display={{ base: "none", md: "flex" }}
              >
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  <Flex alignItems={"center"} gap={4}>
                    <Avatar
                      src="/profilepic.png"
                      size={"sm"}
                      name="As a programmer"
                    />
                    <Text fontWeight={"bold"} fontSize={12}>
                      {posts.username}
                    </Text>
                  </Flex>
                  
                  {authUser?._id === posts.user._id && (
                    <Button
                      size={"sm"}
                      bg={"transparent"}
                      _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                      borderRadius={4}
                      p={1}
                      onClick={handleDeletePost}
                      isLoading={isDeleting}
                    >
                      <MdDelete size={20} cursor="pointer" />
                    </Button>
                  )}
                </Flex>
                <Divider my={4} bg={"gray.500"} />
                <VStack
                  w="full"
                  alignItems={"start"}
                  maxH={"350px"}
                  overflowY={"auto"}
                >
                  {posts.comments?.length > 0 ? (
                    posts.comments.map((comment, idx) => (
                      <Comment key={idx} comment={comment} />
                    ))
                  ) : (
                    <Text>No comments yet</Text>
                  )}
                </VStack>
                <Divider my={4} bg={"gray.800"} />

                <PostFooter post={posts} isProfilePage={true} />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfilePost;
