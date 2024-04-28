import { useState } from 'react';
import axios from 'axios';
export default function Schedules() {
    // initialize empty state
    const [data, setData] = useState({
      route: '',
      stops: '',
    })
    const [error, setError] = useState('');
  
    const getSchedules = async (evt) => {
      evt.preventDefault();
      const selectedRoute = evt.target.route.value;
      console.log('route', selectedRoute);
      try {
        const res = await axios.get('/schedules', {
            params: {route: selectedRoute}
        });
        console.log('res', res.data);
        if (res.status === 200) {
            const { selectedRoute, stopsLink } = res.data;
            setData({
                route: selectedRoute,
                stops: stopsLink,
            });
            setError('');
        } else {
            setError("error occured");
        }
      } catch (e) {
        // display error response from the server
        if (e.response && e.response.data && e.response.data.error) {
          setError(e.response.data.error);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('error:', e);
      }
    }
    return (
      <div>
        <form onSubmit={getSchedules}>
            <label htmlFor="route">Choose a route to view:</label>
            <select name="route" id="route">
                <option value="Route A">Route A</option>
                <option value="Route B">Route B</option>
                <option value="Route C">Route C</option>
                <option value="Route E">Route E</option>
                <option value="Route F">Route F</option>
                <option value="Route G">Route G</option>
                <option value="Route W">Route W</option>
            </select>
            <button type="submit">Submit</button>
        </form>
        {/* render the error message if it exists */}
        {error && <p className="error-message">{error}</p>}
        {/* Conditionally render the stops link if it exists */}
        {data.stops && (
            <p>
            Stops link for {data.route}: <a href={data.stops} target="_blank" rel="noopener noreferrer">{data.stops}</a>
            </p>
        )}
      </div>
    )
}