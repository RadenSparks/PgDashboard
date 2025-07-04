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
import api from '../../../api/axios-client';

const SignIn = () => {
    const navigate = useNavigate();
    const [revealPwd, setRevealPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mfaStep, setMfaStep] = useState(false);
    const [mfaCode, setMfaCode] = useState('');
    const toast = useToast();
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleRevealPassword = () => setRevealPwd(!revealPwd);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email || !password) {
            toast({
                title: 'Missing fields',
                description: 'Please enter both email and password.',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: 'top',
            });
            return;
        }
        setLoading(true);
        api.post('/api/auth/signin', { email, password })
            .then(({ data }) => {
                if (data.mfaRequired) {
                    setMfaStep(true);
                    toast({
                        title: 'MFA Required',
                        description: data.message || 'Check your email for the confirmation code.',
                        status: 'info',
                        duration: 6000,
                        isClosable: true,
                        position: 'top',
                    });
                } else {
                    // fallback, should not happen
                    toast({
                        title: 'Unexpected response',
                        description: 'Please contact support.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'top',
                    });
                }
            })
            .catch((error) => {
                toast({
                    title: 'Sign in failed',
                    description: error.response?.data?.message || error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
                console.error('Sign in failed:', error.response?.data || error.message);
            })
            .finally(() => setLoading(false));
    };

    const handleMfaSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!mfaCode) {
            toast({
                title: 'Missing code',
                description: 'Please enter the code sent to your email.',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: 'top',
            });
            return;
        }
        setLoading(true);
        api.post('/api/auth/verify-mfa', { email, code: mfaCode })
            .then(({ data }) => {
                // data: { token, username, role }
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);
                navigate('/');
            })
            .catch((error) => {
                toast({
                    title: 'Verification failed',
                    description: error.response?.data?.message || error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
                console.error('MFA failed:', error.response?.data || error.message);
            })
            .finally(() => setLoading(false));
    };

    const handleNavigateSignup = () => {
        if (containerRef.current) {
            containerRef.current.classList.add('fade-out');
            setTimeout(() => {
                navigate('/signup');
            }, 300);
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
                {!mfaStep ? (
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={6} w="full">
                            <Heading fontSize="2xl" textAlign="center" color="blue.700" mb={2}>
                                Sign in to your account
                            </Heading>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    size="lg"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={revealPwd ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        size="lg"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
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
                ) : (
                    <form onSubmit={handleMfaSubmit}>
                        <Stack spacing={6} w="full">
                            <Heading fontSize="2xl" textAlign="center" color="blue.700" mb={2}>
                                Enter Confirmation Code
                            </Heading>
                            <FormControl id="mfaCode" isRequired>
                                <FormLabel>Code sent to your email</FormLabel>
                                <Input
                                    type="text"
                                    name="mfaCode"
                                    placeholder="Enter the code"
                                    size="lg"
                                    value={mfaCode}
                                    onChange={e => setMfaCode(e.target.value)}
                                />
                            </FormControl>
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
                                Verify & Sign in
                            </Button>
                        </Stack>
                    </form>
                )}
            </Box>
        </Flex>
    )
}

export default SignIn;
