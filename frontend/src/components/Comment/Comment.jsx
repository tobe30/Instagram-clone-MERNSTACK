import { Avatar, Flex, Text } from "@chakra-ui/react"
import useAuthUser from "../../hooks/useAuthUser";
import { timeAgo } from "../../hooks/timeAgo";


const Comment = ({comment,profilePic}) => {
      const { data: authUser } = useAuthUser();
    
  return <Flex gap={4}>
            <Avatar src={profilePic} name={authUser.username} size={"sm"} />

            <Flex direction={"column"}>
                <Flex gap={2} >
                        <Text fontWeight={"bold"} fontSize={12}>
                            {authUser.username}
                        </Text>
                        <Text fontSize={14}>
                            {comment.text}
                            </Text>
                </Flex>

                <Text fontSize={12} color={"gray"}>
                {timeAgo(comment.createdAt)}
                </Text>
            </Flex>
  </Flex>
}

export default Comment