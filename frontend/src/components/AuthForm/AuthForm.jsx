import { Box, Button, Flex, Image, Input, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
    const [isLogin, setisLogin] = useState(true);
   
    const [inputs,setInputs] = useState({
        email:'',
        password:'',
        confirmPassword:''
    });

	const queryClient = useQueryClient();
    const navigate = useNavigate();

    
    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ email, password }) => {
            try {
                // Select endpoint based on isLogin state
                const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
                
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });
    
                const data = await res.json();
    
                // Throw error if the response is not ok
                if (!res.ok) {
                    throw new Error(data.error || "Failed to process request");
                }
    
                return data;
    
            } catch (err) {
                // Handle any errors that occur during fetch or response parsing
                throw new Error(err.message || "Something went wrong");
            }
        },
    
        // Success handling (only if mutation is successful)
        onSuccess: (data) => {
            toast.success(`${isLogin ? "Logged in" : "Signed up"} successfully!`);
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            navigate("/");
        },
    
        // Error handling (only if mutation fails)
        onError: (err) => {
            toast.error(err.message);
        }
    });
    
    

   
    

   const handleAuth = () => {
    const { email, password, confirmPassword } = inputs;

    if (!email || !password || (!isLogin && !confirmPassword)) {
      return toast.error("Please fill all the fields");
    }

    if (!isLogin && password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    mutate({ email, password }); //use mutate: email p, instead of inputs because we want to ignore confirmpassword
  };

  return <>
    <Box border={"1px solid grey"} borderRadius={4} padding={5}>
        <VStack spacing={3}>
            <Image src='/logo.png' h={24} cursor={"pointer"} alt='instagram'/>
            <Input
                placeholder="Email"
                fontSize={14}
                type="email"
                value={inputs.email}
                onChange={(e) => setInputs({...inputs,email:e.target.value})}
            />
            <Input
                placeholder="Password"
                fontSize={14}
                type="password"
                value={inputs.password}
                onChange={(e) => setInputs({...inputs,password:e.target.value})}
            />

            {!isLogin ? (

            <Input
            placeholder="Confirm Password"
            fontSize={14}
            type="password"
            value={inputs.confirmPassword}
            onChange={(e) => setInputs({...inputs,confirmPassword:e.target.value})}
        />
            ) : null}

        <Button w={"full"} colorScheme='blue' size={"sm"} fontSize={14} onClick={handleAuth}  isLoading={isPending}>
            {isLogin? "Log in" : "Sign up"}
        </Button>

            {/* ---- OR --- */}
        <Flex alignItems={"center"} justifyContent={"center"} my={4} gap={1} w={"full"}>
            <Box flex={2} h={"1px"} bg={"gray.400"}/>
            <Text mx={1} color={"white"}>OR</Text>
            <Box flex={2} h={"1px"} bg={"gray.400"}/>
        </Flex>

        <Flex alignItems={"center"} justifyContent={"center"} cursor={"pointer"}>
            <Image src="/google.png" w={5} alt="google logo"/>
            <Text mx="2" color={"blue.500"}>
                Log in with Google
            </Text>
        </Flex>
        </VStack>
    </Box>

    <Box border={"1px solid gray"} borderRadius={4} padding={5}>
        <Flex alignItems={"center"} justifyContent={"center"}>
            <Box mx={2} fontSize={14}>

                {isLogin ? "Don't have an account?": "Already have an account?"}
            </Box>
            <Box onClick={() => setisLogin(!isLogin)} color={"blue.500"} cursor={"pointer"}>
                {isLogin ? "Sign Up" : "Log in"}
            </Box>
            {isError && <p className='text-red-500'>{error.message}</p>}
        </Flex>
    </Box>
    </>
  
}

export default AuthForm