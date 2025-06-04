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
    useToast,
} from '@chakra-ui/react'
import { useState, useRef } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [revealPwd, setRevealPwd] = useState(false);
    const [revealConfirmPwd, setRevealConfirmPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleRevealPassword = () => setRevealPwd(!revealPwd);
    const toggleRevealConfirmPassword = () => setRevealConfirmPwd(!revealConfirmPwd);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const email = formData.get('email') as string;

        if (!username || !email || !password || !confirmPassword) {
            toast({
                title: 'Missing fields',
                description: 'Please fill in all required fields.',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: 'top',
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match!",
                description: "Please make sure your passwords match.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setLoading(true);
        api.post('/auth/signup', { username, password, email })
            .then(() => {
                toast({
                    title: "Account created!",
                    description: "You can now sign in with your new account.",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                    position: "top",
                });
                setTimeout(() => navigate('/signin'), 500);
            })
            .catch((error: AxiosError) => {
                toast({
                    title: "Sign up failed",
                    description: (typeof error.response?.data === 'object' && error.response?.data && 'message' in error.response.data)
                        ? (error.response.data as { message?: string }).message
                        : 'An error occurred during sign up.',
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                console.error('Sign up failed:', error.response?.data || error.message);
            })
            .finally(() => setLoading(false));
    };

    const handleNavigateSignin = () => {
        if (containerRef.current) {
            containerRef.current.classList.add('fade-out');
            setTimeout(() => {
                navigate('/signin');
            }, 300);
        } else {
            navigate('/signin');
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('blue.50', 'gray.900')}>
            <Box
                ref={containerRef}
                bg={useColorModeValue('white', 'gray.800')}
                p={{ base: 6, md: 10 }}
                rounded="2xl"
                shadow="xl"
                w="full"
                maxW="md"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                className="signin-transition"
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
                                        aria-label={revealPwd ? "Hide password" : "Show password"}
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
                                        aria-label={revealConfirmPwd ? "Hide password" : "Show password"}
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
                                isLoading={loading}
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
                                    onClick={handleNavigateSignin}
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

/*
.signin-transition {
    transition: opacity 0.3s;
    opacity: 1;
}
.signin-transition.fade-out {
    opacity: 0;
}
*/