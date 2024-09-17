/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserDetails } from './types/types';
import axios from 'axios';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [storedUserDetails, setStoredUserDetails] = useState<UserDetails | null>(null); // For storing localStorage details
    const router = useRouter();

    useEffect(() => {
      const email = localStorage.getItem('email');

      const fetchUserDetails = async () => {
        if (email) {
          const userDetailsString = localStorage.getItem('userDetails');
          const localUserDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
          setStoredUserDetails(localUserDetails); // Store localStorage data
          console.log('local', localUserDetails);

          if (localUserDetails?.email) {
            try {
              const response = await axios.get(
                `https://backend-dev-chess.vercel.app/getuserdetails?email=${localUserDetails.email}`
              );
              const apiUserDetails = response.data.data;
              setUserDetails(apiUserDetails); // Store API data
              console.log('API data:', apiUserDetails);

              // Check session_id mismatch and redirect if necessary
              if (localUserDetails.session_id !== apiUserDetails.session_id) {
                localStorage.clear();
                router.replace('/signin');
              }
            } catch (error) {
              console.error('Error fetching user details:', error);
            }
          }
        } else {
          // Redirect if email is not found
          router.replace('/signin');
        }
      };

      fetchUserDetails();
    }, [router]);

    return (
      <WrappedComponent
        {...props}
        userDetails={userDetails}
        storedUserDetails={storedUserDetails} // Pass both variables as props
      />
    );
  };
};

export default withAuth;
