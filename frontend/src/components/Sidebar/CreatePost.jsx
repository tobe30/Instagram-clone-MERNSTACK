import {
  Box,
  Flex,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { BsFillImageFill } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const fileInputRef = useRef(null);

//   const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {mutate: createPost,isPending,isError,error,} = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/post/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
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
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setImg(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

  return (
    <>
      <Tooltip
        hasArrow
        label={"Create"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
        <Flex
          alignItems={"center"}
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          onClick={onOpen} // 🟢 This opens the modal
        >
          <CreatePostLogo />
          <Box display={{ base: "none", md: "block" }}>Create</Box>
        </Flex>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />

        <ModalContent bg={"black"} border={"1px solid gray"}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Textarea
              placeholder="Post caption..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              mb={3}
            />

            <Input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleImgChange} // 🟢
            />

            {img && (
                <Box mt={3}>
                <img
                    src={img}
                    alt="Preview"
                    style={{ width: "100%", height: "auto", objectFit: "contain" }}
                />
                </Box>
            )}

            <BsFillImageFill
              style={{
                marginTop: "15px",
                marginLeft: "5px",
                cursor: "pointer",
              }}
              size={20}
              onClick={() => fileInputRef.current.click()}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => createPost({ text, img })} disabled={!text && !img} >{isPending ? "Posting..." : "Post"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
