import type { AxiosError } from 'axios';
import api from '../../../api/axios-client';
import {
    Button,
    Checkbox,
    Flex,
    Text,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    InputRightElement,
    InputGroup,
    Box,
    useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import type { SignInRequestDTO, SignInResponseDTO } from '@/entity/dto';

const SignIn = () => {
    const navigate = useNavigate();
    const [revealPwd, setRevealPwd] = useState(false);

    const toggleRevealPassword = () => setRevealPwd(!revealPwd);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const signInRequestDTO: SignInRequestDTO = {
            username : username,
            password : password
        };

        api.post<SignInResponseDTO>('/auth/signin', signInRequestDTO)
            .then(response => {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('role', response.data.role);
                navigate('/');
            })
            .catch((error : AxiosError) => {
                console.error('Sign in failed:', error.response?.data || error.message);
            });
    }

    return (
        <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('blue.50', 'gray.900')}>
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={{ base: 6, md: 10 }}
                rounded="2xl"
                shadow="xl"
                w="full"
                maxW="md"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={6} w="full">
                        <Heading fontSize="2xl" textAlign="center" color="blue.700" mb={2}>
                            Sign in to your account
                        </Heading>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input type="text" name="username" placeholder="Enter your username" size="lg" />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={revealPwd ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    size="lg"
                                />
                                <InputRightElement width="3rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        variant="ghost"
                                        onClick={toggleRevealPassword}
                                        tabIndex={-1}
                                    >
                                        {revealPwd ? <BsEye /> : <BsEyeSlash />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={4}>
                            <Flex align="center" justify="space-between">
                                <Checkbox colorScheme="blue">Remember me</Checkbox>
                                <Text color="blue.500" fontWeight="medium" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                    Forgot password?
                                </Text>
                            </Flex>
                            <Button
                                colorScheme="blue"
                                size="lg"
                                type="submit"
                                rounded="lg"
                                fontWeight="bold"
                                shadow="md"
                                _hover={{ bg: "blue.600" }}
                            >
                                Sign in
                            </Button>
                            <Text textAlign="center" color="gray.500">
                                Don't have an account?{" "}
                                <Text
                                    as="span"
                                    color="blue.500"
                                    fontWeight="medium"
                                    cursor="pointer"
                                    _hover={{ textDecoration: "underline" }}
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign up
                                </Text>
                            </Text>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Flex>
    )
}

export default SignIn;