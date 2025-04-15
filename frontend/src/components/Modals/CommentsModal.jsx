 import {
 	Button,
 	Flex,
 	Input,
 	Modal,
 	ModalBody,
 	ModalCloseButton,
 	ModalContent,
 	ModalHeader,
 	ModalOverlay,
 } from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";


 const CommentsModal = ({ isOpen, onClose, post }) => {
	const [comment, setComment] = useState("");
	const queryClient = useQueryClient();



	const { mutate: commentPost, isPending: isCommenting} = useMutation({
		mutationFn: async () => {
		  try {
			const res  = await fetch(`/api/post/comment/${post._id}`, {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({ text: comment }),
			})
			const data = await res.json();
	
			if(!res.ok){
			  throw new Error(data.error || "Something went wrong");
			}
			return data;
		  } catch (error) {
			throw new Error(error);
		  }
		},
		onSuccess: () => {
		  toast.success("Comment posted successfully")
		  setComment("");
		  queryClient.invalidateQueries({ queryKey: ["posts"]})
		},
		onError: (error) => {
		  toast.error(error.message);
		}
	  })

	  const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	  };
    
 	return (
 		<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
 			<ModalOverlay />
 			<ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
 				<ModalHeader>Comments</ModalHeader>
 				<ModalCloseButton />
 				<ModalBody pb={6}>
 					<Flex mb={4} gap={4} flexDir={"column"} maxH={"250px"} overflowY={"auto"}>
                        {post.comments.map((comment, idx) => (
                            <Comment key={idx} comment = {comment} />
                        ))}
                        
                    </Flex>
 					<form onSubmit={handlePostComment} style={{ marginTop: "2rem" }}>
 						<Input placeholder='Comment' value={comment}
                      onChange={(e) => setComment(e.target.value)} size={"sm"} />
 						<Flex w={"full"} justifyContent={"flex-end"}>
 							<Button  type='submit' ml={"auto"} size={"sm"} my={4}>
 								Post
 							</Button>
 						</Flex>
 					</form>
 				</ModalBody>
 			</ModalContent>
 		</Modal>
 	);
 };

 export default CommentsModal;
