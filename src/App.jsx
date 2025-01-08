import { useEffect, useState } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import './App.css';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)



  // const getAccessToken = async () => {
  //   const url = 'https://www.linkedin.com/oauth/v2/accessToken';
  //   const headers = {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'Cookie': 'bcookie="v=2&edbdc6e0-4674-4505-8c0f-338e87fb56b7"; lang=v=2&lang=en-us; lidc="b=OGST00:s=O:r=O:a=O:p=O:g=3527:u=1:x=1:i=1736241305:t=1736327705:v=2:sig=AQFaa8XAsxlgCJHyGPUtoBm4lXLPumn2"; JSESSIONID=ajax:3201351744816563250; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImZsb3dUcmFja2luZ0lkIjoiRmt2R05LbS9SMXFkQndENXp2NVU5QT09In0sIm5iZiI6MTczNjIzNjc1OSwiaWF0IjoxNzM2MjM2NzU5fQ.MrHpkbnNyRPN0vygAeklTj7drtMUeIdZssHPi0Lpq70; bscookie="v=1&202501070743415c9fc090-880e-4c0c-8766-1d2b39997334AQGx3xf0MFO1CkGxXK2t9Sw0IretYqCM"',
  //   };

  //   const data = new URLSearchParams();

  //   data.append('grant_type', 'client_credentials');
  //   data.append('client_id', '787bpiy1pormz9');
  //   data.append('client_secret', 'WPL_AP1.uAX2P3Ez3VvBLlsu.TQtTDw==');

  //   try {
  //     const response = await axios.post(url, data, { headers });
  //     console.log(response.data);
  //     // You will get the access token in response.data
  //   } catch (error) {
  //     console.error('Error fetching access token', error);
  //   }
  // };

  // useEffect(() => {
  //   getAccessToken()
  // }, [])

  const initiateLinkedInAuthentication = () => {
    const CLIENT_ID = '86hxkyeb0qpkdn'; // Your LinkedIn Client ID
    const REDIRECT_URI = encodeURIComponent('https://authtesting-223.netlify.app/callback'); 
    // https://authtesting-223.netlify.app/
    const SCOPE = encodeURIComponent('w_member_social');

    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
    console.log(authorizationUrl);

    window.location.href = authorizationUrl;

    // Redirect the user to LinkedIn's authorization page

  };

  const exchangeCodeForToken = async (authorizationCode) => {

    const CLIENT_ID = '86hxkyeb0qpkdn';
    const CLIENT_SECRET = 'WPL_AP1.6YMZbA8GjbPtGQqc.IaOXSQ==';
    const REDIRECT_URI = 'https://authtesting-223.netlify.app/callback';

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();
    return data.access_token; // You will use this access token to make API calls
  };

  const postJobToLinkedIn = async (accessToken, jobDetails) => {
    const jobPostingPayload = {
      jobPostingRequest: {
        title: jobDetails.title,
        description: jobDetails.description,
        hiringOrganization: {
          name: jobDetails.companyName,
        },
        jobLocation: {
          address: {
            addressLocality: jobDetails.location,
          },
        },
        employmentType: jobDetails.employmentType || 'FULL_TIME',
      },
    };

    const response = await fetch('https://api.linkedin.com/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(jobPostingPayload),
    });

    const result = await response.json();
    return result;
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    if (code) {
      exchangeCodeForToken(code).then((accessToken) => {
        const jobDetails = {
          title: 'Software Engineer',
          description: 'Job description goes here',
          companyName: 'Your Company',
          location: 'Your City',
          employmentType: 'FULL_TIME',
        };

        postJobToLinkedIn(accessToken, jobDetails).then((result) => {
          console.log('Job posted successfully:', result);
        });
      });
    }
  }, []);

  return (
    <>
      <div>
        <button onClick={initiateLinkedInAuthentication}>
          Post a Job on LinkedIn
        </button>
      </div>
    </>
  )
}

export default App
