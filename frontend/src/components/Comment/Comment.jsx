import { Avatar, Flex, Text } from "@chakra-ui/react"
import useAuthUser from "../../hooks/useAuthUser";
import { timeAgo } from "../../hooks/timeAgo";


const Comment = ({comment}) => {
      const { data: authUser } = useAuthUser();
      console.log(comment); // Check the structure of the comment object


  return <Flex gap={4}>
            <Avatar  src={comment.user.profileImg ||  "/avatar-placeholder.png"} name={comment.user?.username} />


            <Flex direction={"column"}>
                <Flex gap={2} >
                        <Text fontWeight={"bold"} fontSize={12}>
                        {comment.user.username}
                        </Text>
                        <Text fontSize={14}>
                            {comment.text}
                            </Text>
                </Flex>

                <Text fontSize={12} color={"gray"}>
                {/* {timeAgo(comment.createdAt)} */}
                </Text>
            </Flex>
  </Flex>
}

export default Comment