import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function MyRoutes() {
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState('');

    // Fetch the current user's saved routes
    useEffect(() => {
        const fetchSavedRoutes = async () => {
            try {
                // Retrieve the user's token from local storage
                const token = localStorage.getItem('token');

                // If no token, prompt the user to log in
                if (!token) {
                    setError('Please log in first.');
                    return;
                }

                // Fetch the user's saved routes from the server
                const res = await axios.get('/myroutes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Check for a successful response
                if (res.status === 200) {
                    //console.log('res',res);
                    // Update state with the saved routes
                    setRoutes(res.data.currentUser.MyRoutes);
                    setError('');
                } else {
                    setError('An error occurred while fetching saved routes.');
                }
            } catch (e) {
                // Handle errors while fetching saved routes
                setError('An error occurred while fetching saved routes.');
                console.error('Error fetching saved routes:', e);
            }
        };

        fetchSavedRoutes();
    }, []);

    // Render the component
    return (
        <div>
            <h1>My Routes</h1>

            {/* Link to add new routes */}
            <Link to="/myroutes/select">Select Routes</Link>

            {/* Display the error message, if any */}
            {error && <p className="error-message">{error}</p>}

            {/* Display the saved routes, if available */}
            {!error && routes.length > 0 && (
                <ul>
                    {routes.map((route, index) => (
                        <li key={index}>
                            <a href={route.stops} target="_blank" rel="noopener noreferrer">
                                {route.route}
                            </a>
                        </li>
                    ))}
                </ul>
            )}

            {/* If there are no saved routes and no error */}
            {!error && routes.length === 0 && (
                <p>You have not saved any routes yet.</p>
            )}
        </div>
    );
}