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
import type { SignInResponseDTO } from '@/entity/dto';

const SignIn = () => {
    const navigate = useNavigate();
    const [revealPwd, setRevealPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleRevealPassword = () => setRevealPwd(!revealPwd);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        if (!username || !password) {
            toast({
                title: 'Missing fields',
                description: 'Please enter both username and password.',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: 'top',
            });
            return;
        }

        setLoading(true);

        fetch('http://localhost:3000/api/auth/signin', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: username, password }),
        })
            .then(async response => {
                if (!response.ok) {
                    // Optionally parse error message from backend
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Sign in failed");
                }
                // Type the response as SignInResponseDTO
                return response.json() as Promise<SignInResponseDTO>;
            })
            .then((data) => {
                // Now data is typed as SignInResponseDTO
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);
                navigate('/');
            })
            .catch((error: Error) => {
                toast({
                    title: 'Sign in failed',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
                console.error('Sign in failed:', error.message);
            })
            .finally(() => setLoading(false));
    }

    const handleNavigateSignup = () => {
        if (containerRef.current) {
            containerRef.current.classList.add('fade-out');
            setTimeout(() => {
                navigate('/signup');
            }, 300); // duration matches the CSS transition
        } else {
            navigate('/signup');
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
                                        aria-label={revealPwd ? "Hide password" : "Show password"}
                                    >
                                        {revealPwd ? <BsEye /> : <BsEyeSlash />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={4}>
                            <Flex align="center" justify="space-between">
                                <Checkbox colorScheme="blue">Remember me</Checkbox>
                                <Text
                                    color="blue.500"
                                    fontWeight="medium"
                                    cursor="pointer"
                                    _hover={{ textDecoration: "underline" }}
                                    onClick={() => toast({
                                        title: "Forgot password?",
                                        description: "Password reset is not implemented yet.",
                                        status: "info",
                                        duration: 4000,
                                        isClosable: true,
                                        position: "top",
                                    })}
                                >
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
                                isLoading={loading}
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
                                    onClick={handleNavigateSignup}
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
