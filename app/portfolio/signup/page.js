// // frontend/app/portfolio/signup/page.js

// 'use client'; // Mark this file as a client-side component

// import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Use 'next/navigation' for client-side routing
// import { Input, Button } from '../../components/ui'; // Adjust the import based on your directory structure

// const PortfolioSignUp = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const router = useRouter(); // Using client-side router

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Your sign-up logic here

//     // Simple validation check
//     if (!name || !email) {
//       setError('Name and Email are required');
//       return;
//     }

//     setLoading(true);
//     setError(null); // Reset any previous errors

//     try {
//       // Send the sign-up data to the backend using axios
//       const response = await axios.post('/api/portfolio/signup', {
//         name,
//         email,
//       });

//       if (response.status === 201) {
//         // On successful sign-up, redirect to the dashboard
//         router.push('/portfolio/dashboard');
//       }
//     } catch (err) {
//       // Handle any errors during the request
//       setError('Something went wrong. Please try again later.');
//       console.error(err);
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h1>Create Your Portfolio</h1>
//       <form onSubmit={handleSubmit}>
//         <Input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <Input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Button type="submit">Sign Up</Button>
//       </form>
//     </div>
//   );
// };

// export default PortfolioSignUp;
'use client'; // Mark this file as a client-side component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for client-side routing
import { Input, Button } from '../../components/ui'; // Adjust the import based on your directory structure

const PortfolioSignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // To track form submission state
  const [error, setError] = useState(null); // To track errors
  const router = useRouter(); // Using client-side router

  // Mark the handleSubmit function as async
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation check
    if (!name || !email) {
      setError('Name and Email are required');
      return;
    }

    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      // Send the sign-up data to the backend using axios
      const response = await axios.post('/api/portfolio/signup', {
        name,
        email,
      });

      if (response.status === 201) {
        // On successful sign-up, redirect to the dashboard
        router.push('/portfolio/dashboard');
      }
    } catch (err) {
      // Handle any errors during the request
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="signup-container">
      <h1>Create Your Portfolio</h1>
      {error && <p className="error-message">{error}</p>} {/* Show error if any */}
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

export default PortfolioSignUp;
