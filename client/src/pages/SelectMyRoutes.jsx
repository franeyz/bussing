import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SelectMyRoutes() {
    const [allSchedules, setSchedules] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch all schedules and the user's saved routes 
    useEffect(() => {
        // Retrieve the user's token from local storage
        const token = localStorage.getItem('token');

        // If no token, prompt the user to log in
        if (!token) {
            setError('Please log in first.');
            return;
        }
        const fetchRoutes = async () => {
            try {
                // Fetch all schedules from the server
                const res = await axios.get('/myroutes/select', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.status === 200) {
                    // Store the user and  schedules in state
                    setCurrentUser(res.data.currentUser);
                    setSchedules(res.data.allSchedules);
                } else {
                    setError('Failed to fetch data.');
                }
            } catch (e) {
                // Handle errors during fetching
                if (e.response && e.response.data && e.response.data.error) {
                    setError(e.response.data.error);
                  } else {
                    setError('An unexpected error occurred. Please try again.');
                  }
                  console.error('error:', e);
            }
        };

        fetchRoutes();
    }, []);

    // Handle form submission to update the user's routes
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            // Retrieve the user's token from local storage
            const token = localStorage.getItem('token');
            console.log('current user in handleSubmit', currentUser);
            // convert checked checkboxes to an array of route ids
            const selectedRoutes = Array.from(evt.target.elements)
            .filter((element) => element.type === 'checkbox' && element.checked)
            .reduce((acc, element) => {
                acc.push(element.value);
                return acc;
            }, []);
            // Send the selected routes to the server
            const res = await axios.post('/myroutes/update', {
                selectedRoutes,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('updated user routes', res.data.updatedUser.MyRoutes);
            // If successful, navigate back to the MyRoutes page
            if (res.status === 200) {
                navigate('/myroutes');
            } else {
                setError('Failed to update routes.');
            }
            
        } catch (e) {
            // Handle errors during updating
            setError('An error occurred while updating routes.');
            console.error('Error updating routes:', e);
        }
    };

    return (
        <div>
            <h1>Update My Routes</h1>

            {/* Display the error message, if any */}
            {error && <p className="error-message">{error}</p>}
        
            {/* Display the form with checkboxes for each schedule */}
            {!error && allSchedules.length > 0 && (
                <form onSubmit={handleSubmit}>
                    {allSchedules.map((schedule) => (
                        <div key={schedule._id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={schedule._id}
                                />
                                {schedule.route}
                            </label>
                        </div>
                    ))}
                    <button type="submit">Save Routes</button>
                </form>
            )}

            {/* If there are no schedules and no error */}
            {!error && allSchedules.length === 0 && (
                <p>No routes available.</p>
            )}
        
        </div>
    );
}