import { useState, useEffect } from 'react';
import API from '../API';
// helpers
import { isPersistedState } from '../helpers';

export const useMovieFetch = movieId => {
    const [state, setState] = useState({});
    const [loading, setloading] = useState(true);
    const[error, setError] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setloading(true);
                setError(false);

                const movie = await API.fetchMovie(movieId);
                const credits = await API.fetchCredits(movieId);
                // get directors only
                const directors = credits.crew.filter(
                    member => member.job === 'Director'
                );

                setState({
                    ...movie, 
                    actors: credits.cast,
                    directors 
                });

                setloading(false);
            } catch (error) {
                setError(true);
            }
        };

        const sessionState = isPersistedState(movieId);

        if (sessionState) {
            setState(sessionState);
            setloading(false);
            return;
        }

        fetchMovie();
    }, [movieId]);

    // write to session storage
    useEffect(() => {
        sessionStorage.setItem(movieId, JSON.stringify(state));
    }, [movieId, state])

    return { state, loading, error };

};