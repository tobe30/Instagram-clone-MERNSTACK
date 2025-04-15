import { Box, Image } from "@chakra-ui/react"
import PostFooter from "./PostFooter"
import PostHeader from "./PostHeader"

const FeedPost = ({post}) => {
  return (
    <>
       <PostHeader post={post}/> 
       <Box my={2} borderRadius={4} overflow={"hidden"}>
        <Image src={post.img} alt="hello"/>
       </Box>
       <PostFooter post={post} />
    </>
  )
}

export default FeedPost