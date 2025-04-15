import { Box, Container, Flex, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react"
import FeedPost from "./FeedPost"
import { useEffect, useState } from "react"
import {useQuery } from "@tanstack/react-query";


const FeedPosts = () => {

  const {data:posts, isLoading, isError, error} = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/post/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    
  })



  return (
    <Container maxW={"container.sm"} py={10} px={2}>
        {isLoading && [0,1,2,3].map((_,idx) => (
          <VStack key={idx} gap={4} alignItems={"flex-start"} mb={10}>
            <Flex gap="2">
              <SkeletonCircle size='10'/>
              <VStack gap={2} alignItems={"flex-start"}>
              <Skeleton height='10px' w={"200px"}/>
              <Skeleton height='10px' w={"200px"}/>
              </VStack>
              </Flex>
              <Skeleton w={"full"}>
                  <Box h={"500px"}>Content wrapped</Box>
              </Skeleton>
          
          </VStack>
        ))}

         {/* Display an error message if the query fails */}
      {isError && (
        <div className="text-center text-red-500">
          <p>Error fetching posts: {error.message}</p>
        </div>
      )}

      {/* If no posts, display message */}
      {!isLoading && posts?.length === 0 && (
        <p className="text-center my-4">No posts available. Try again later.</p>
      )}
          {!isLoading && posts && (
            <>
        {posts.map((post) => (
            <FeedPost key={post._id} post={post} />
          ))}
            </>
          )}

    </Container>
  )
}

export default FeedPosts