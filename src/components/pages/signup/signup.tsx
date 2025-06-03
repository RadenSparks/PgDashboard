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

const SignUp = () => {
    const navigate = useNavigate();
    const [revealPwd, setRevealPwd] = useState(false);
    const [revealConfirmPwd, setRevealConfirmPwd] = useState(false);

    const toggleRevealPassword = () => setRevealPwd(!revealPwd);
    const toggleRevealConfirmPassword = () => setRevealConfirmPwd(!revealConfirmPwd);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: call sign up api here, then navigate to sign in or dashboard;
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const email = formData.get('email') as string;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        api.post('/auth/signup', { username, password, email })
            .then(() => {
                navigate('/signin');
            })
            .catch((error: AxiosError) => {
                console.error('Sign up failed:', error.response?.data || error.message);
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
                            Create your account
                        </Heading>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input type="text" name="username" placeholder="Enter your username" size="lg" />
                        </FormControl>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" name="email" placeholder="Enter your email" size="lg" />
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
                        <FormControl id="confirmPassword" isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={revealConfirmPwd ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    size="lg"
                                />
                                <InputRightElement width="3rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        variant="ghost"
                                        onClick={toggleRevealConfirmPassword}
                                        tabIndex={-1}
                                    >
                                        {revealConfirmPwd ? <BsEye /> : <BsEyeSlash />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={4}>
                            <Checkbox colorScheme="blue" isRequired>
                                I agree to the Terms and Conditions
                            </Checkbox>
                            <Button
                                colorScheme="blue"
                                size="lg"
                                type="submit"
                                rounded="lg"
                                fontWeight="bold"
                                shadow="md"
                                _hover={{ bg: "blue.600" }}
                            >
                                Sign up
                            </Button>
                            <Text textAlign="center" color="gray.500">
                                Already have an account?{" "}
                                <Text
                                    as="span"
                                    color="blue.500"
                                    fontWeight="medium"
                                    cursor="pointer"
                                    _hover={{ textDecoration: "underline" }}
                                    onClick={() => navigate('/signin')}
                                >
                                    Sign in
                                </Text>
                            </Text>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Flex>
    )
}

export default SignUp;