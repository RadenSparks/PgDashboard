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
    Divider,
} from '@chakra-ui/react'
import { useState, useRef } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
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
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bgGradient="linear(to-br, blue.100, blue.200 60%, blue.50)"
            position="relative"
            overflow="hidden"
        >
            {/* Decorative background shapes */}
            <Box
                position="absolute"
                top="-80px"
                left="-80px"
                w="300px"
                h="300px"
                bgGradient="radial(ellipse at center, blue.200 60%, transparent 100%)"
                filter="blur(40px)"
                zIndex={0}
            />
            <Box
                position="absolute"
                bottom="-100px"
                right="-100px"
                w="320px"
                h="320px"
                bgGradient="radial(ellipse at center, yellow.100 60%, transparent 100%)"
                filter="blur(60px)"
                zIndex={0}
            />
            <Box
                ref={containerRef}
                bg={useColorModeValue('white', 'gray.800')}
                p={{ base: 6, md: 10 }}
                rounded="2xl"
                shadow="2xl"
                w="full"
                maxW="md"
                border="1.5px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                className="signin-transition"
                zIndex={1}
                position="relative"
            >
                <Stack spacing={6} w="full">
                    <Flex direction="column" align="center" mb={2}>
                        <Box
                            mb={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width="auto"
                            height="auto"
                            bgGradient="linear(to-br, blue.200, blue.300, blue.100)"
                            borderRadius="full"
                            p={3}
                        >
                            <img
                                src="/assets/icons/logopengoo.png"
                                alt="Pengoo Logo"
                                width={120}
                                height={120}
                                draggable={false}
                                style={{
                                    objectFit: "contain",
                                    pointerEvents: "none",
                                    userSelect: "none",
                                    borderRadius: "50%",
                                    width: 120,
                                    height: 120,
                                    boxShadow: "0 2px 12px 0 rgba(30,64,175,0.10)"
                                }}
                            />
                        </Box>
                        <Heading fontSize="2xl" textAlign="center" color="blue.700" fontWeight="extrabold" letterSpacing="tight">
                            Đăng nhập Pengoo Dashboard
                        </Heading>
                        <Text fontSize="sm" color="gray.500" mt={1}>
                            Quản lý hệ thống của bạn một cách dễ dàng
                        </Text>
                    </Flex>
                    <Divider borderColor="blue.100" mb={2} />
                    {!mfaStep ? (
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={5} w="full">
                                <FormControl id="email" isRequired>
                                    <FormLabel fontWeight="semibold" color="blue.800">Email</FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Nhập email của bạn"
                                        size="lg"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        bg="blue.50"
                                        borderColor="blue.100"
                                        _focus={{ borderColor: "blue.400", bg: "white" }}
                                        rounded="lg"
                                    />
                                </FormControl>
                                <FormControl id="password" isRequired>
                                    <FormLabel fontWeight="semibold" color="blue.800">Mật khẩu</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={revealPwd ? "text" : "password"}
                                            name="password"
                                            placeholder="Nhập mật khẩu"
                                            size="lg"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            bg="blue.50"
                                            borderColor="blue.100"
                                            _focus={{ borderColor: "blue.400", bg: "white" }}
                                            rounded="lg"
                                        />
                                        <InputRightElement width="3rem">
                                            <Button
                                                h="1.75rem"
                                                size="sm"
                                                variant="ghost"
                                                onClick={toggleRevealPassword}
                                                tabIndex={-1}
                                                aria-label={revealPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                            >
                                                {revealPwd ? <BsEye /> : <BsEyeSlash />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                <Flex align="center" justify="space-between" mt={-2}>
                                    <Checkbox colorScheme="blue" fontWeight="medium">Ghi nhớ đăng nhập</Checkbox>
                                    <Text
                                        color="blue.500"
                                        fontWeight="medium"
                                        cursor="pointer"
                                        fontSize="sm"
                                        _hover={{ textDecoration: "underline" }}
                                        onClick={() => toast({
                                            title: "Quên mật khẩu?",
                                            description: "Chức năng khôi phục mật khẩu sẽ sớm có mặt.",
                                            status: "info",
                                            duration: 4000,
                                            isClosable: true,
                                            position: "top",
                                        })}
                                    >
                                        Quên mật khẩu?
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
                                    mt={2}
                                >
                                    Đăng nhập
                                </Button>
                                <Text textAlign="center" color="gray.500" fontSize="sm">
                                    Chưa có tài khoản?{" "}
                                    <Text
                                        as="span"
                                        color="blue.500"
                                        fontWeight="medium"
                                        cursor="pointer"
                                        _hover={{ textDecoration: "underline" }}
                                        onClick={handleNavigateSignup}
                                    >
                                        Đăng ký ngay
                                    </Text>
                                </Text>
                            </Stack>
                        </form>
                    ) : (
                        <form onSubmit={handleMfaSubmit}>
                            <Stack spacing={5} w="full">
                                <Heading fontSize="xl" textAlign="center" color="blue.700" mb={2}>
                                    Nhập mã xác thực
                                </Heading>
                                <FormControl id="mfaCode" isRequired>
                                    <FormLabel>Mã xác thực đã gửi tới email</FormLabel>
                                    <Input
                                        type="text"
                                        name="mfaCode"
                                        placeholder="Nhập mã xác thực"
                                        size="lg"
                                        value={mfaCode}
                                        onChange={e => setMfaCode(e.target.value)}
                                        bg="blue.50"
                                        borderColor="blue.100"
                                        _focus={{ borderColor: "blue.400", bg: "white" }}
                                        rounded="lg"
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
                                    Xác nhận & Đăng nhập
                                </Button>
                            </Stack>
                        </form>
                    )}
                </Stack>
            </Box>
        </Flex>
    )
}

export default SignIn;
