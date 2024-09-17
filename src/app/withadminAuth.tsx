/* eslint-disable react/display-name */
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withadminAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      // Replace 'your-username' and 'your-password' with the actual username and password
      const validUsername = 'Admin';
      const validPassword = 'Admin';

      if (username !== validUsername || password !== validPassword) {
        router.replace('/adminsignin'); // Redirect to sign-in if username or password is incorrect
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withadminAuth;
