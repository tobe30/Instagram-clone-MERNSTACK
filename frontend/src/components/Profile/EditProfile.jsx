 
 import {
 	Avatar,
 	Button,
 	Center,
 	Flex,
 	FormControl,
 	FormLabel,
 	Heading,
 	Input,
 	Modal,
 	ModalBody,
 	ModalCloseButton,
 	ModalContent,
 	ModalHeader,
 	ModalOverlay,
 	Stack,
 } from "@chakra-ui/react";
 import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { useEffect, useRef, useState } from "react";


 const EditProfile = ({ isOpen, onClose, authUser }) => {

	const [profileImg, setProfileImg] = useState(null);
	const profileImgRef = useRef(null);


	const [formData, setFormData] = useState({
		username: "",
		email: "",
		bio: "",
	});

	const {updateProfile,isUpdatingProfile} = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	

	const handleImgChange = (e, state) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);  // Log the image data URL for debugging
      state === "profileImg" && setProfileImg(reader.result);
    };
    reader.readAsDataURL(file);
  }
};

	
	  const handleSubmit = async () => {
		try {
		  const payload = { ...formData };
		  if (profileImg) {
			payload.profileImg = profileImg;
		  }
	  
		  await updateProfile(payload);
		  onClose(); // Close the modal after update
		} catch (error) {
		  console.error("Profile update failed:", error);
		}
	  };

	  useEffect(() => {
		if(authUser){
			setFormData({
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
			})
		}
	},[authUser])
	  

 	return (
 		<>
 			<Modal isOpen={isOpen} onClose={onClose}>
 				<ModalOverlay />
 				<ModalContent bg={"black"} boxShadow={"xl"} border={"1px solid gray"} mx={3}>
 					<ModalHeader />
 					<ModalCloseButton />
 					<ModalBody>
 						{/* Container Flex */}
 						<Flex bg={"black"}>
 							<Stack spacing={4} w={"full"} maxW={"md"} bg={"black"} p={6} my={0}>
 								<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
 									Edit Profile
 								</Heading>
 								<FormControl>
									<Stack direction={["column", "row"]} spacing={6}>
										<Center>
										<Avatar size='xl' src={profileImg || authUser?.profileImg || ""} border={"2px solid white "} />
										</Center>
										<Center w='full'>
										<Button w='full' onClick={() => profileImgRef.current?.click()}>Edit Profile Picture</Button>
										<Input
											type='file'
											accept='image/*'
											ref={profileImgRef}
											display='none'
											onChange={(e) => handleImgChange(e, "profileImg")}
										/>
										</Center>
									</Stack>
								</FormControl>


 								<FormControl>
 									<FormLabel fontSize={"sm"}>username</FormLabel>
 									<Input placeholder={"Full Name"} value={formData.username} name={"username"} onChange={handleInputChange} size={"sm"} type={"text"} />
 								</FormControl>

 								<FormControl>
 									<FormLabel fontSize={"sm"}>email</FormLabel>
 									<Input placeholder={"Username"} name={"email"} value={formData.email} onChange={handleInputChange} size={"sm"} type={"text"} />
 								</FormControl>

 								<FormControl>
 									<FormLabel fontSize={"sm"}>Bio</FormLabel>
 									<Input placeholder={"Bio"} name={"bio"} value={formData.bio} onChange={handleInputChange} size={"sm"} type={"text"} />
 								</FormControl>

 								<Stack spacing={6} direction={["column", "row"]}>
 									<Button
 										bg={"red.400"}
 										color={"white"}
 										w='full'
 										size='sm'
 										_hover={{ bg: "red.500" }}
 									>
 										Cancel
 									</Button>
 									<Button
 										bg={"blue.400"}
 										color={"white"}
 										size='sm'
 										w='full'
 										_hover={{ bg: "blue.500" }}
										 onClick={handleSubmit}
 									>
 										{isUpdatingProfile ? "updating..." : "update"}
 									</Button>
 								</Stack>
 							</Stack>
 						</Flex>
 					</ModalBody>
 				</ModalContent>
 			</Modal>
 		</>
 	);
 };

 export default EditProfile;
