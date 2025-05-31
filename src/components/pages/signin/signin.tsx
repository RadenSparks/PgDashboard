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
        //TODO: call sign in api here , get the token and store it in localStorage, then navigate to the dashboard;
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
        <Stack minH={'100vh'} direction={{ base: 'row', md: 'row', lg: 'row', xl: 'row' }} >
            <Flex p={8} flex={1} align={'center'} justify={'center'} border={'1px solid #e2e8f0'}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4} w={'full'} maxW={'md'} >
                        <Heading fontSize={'2xl'}>Sign in to your account</Heading>
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input type="text" name='username' />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type="password" name="password" />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={toggleRevealPassword}>
                                        {revealPwd ? <BsEye /> : <BsEyeSlash />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={6}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                                <Text color={'blue.500'}>Forgot password?</Text>
                            </Stack>
                            <Button colorScheme={'blue'} variant={'solid'} type='submit'>
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Flex>
        </Stack>
    )
}

export default SignIn;