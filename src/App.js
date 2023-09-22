import { useEffect, useState } from "react";
import MovieDetails from "./Components/MovieDetails";
import Box from "./Components/Box";
import MovieList from "./Components/MovieList";
import WatchedList from "./Components/WatchedList";
import Summary from "./Components/Summary";
import Loader from "./Components/Loader";
import Search from "./Components/Search";

const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];
const average = arr =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
	const [movie, setMovie] = useState([]);
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	function handleSelectMovie(id) {
		setSelectedId(selectedId === id ? null : id);
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	// function handleAddWatch

	useEffect(
		function () {
			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError("");
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
					);
					if (!res.ok) {
						throw new Error("Something went wrong...");
					}
					const data = await res.json();
					if (data.Response === "False") {
						throw new Error("movie not found");
					}
					setMovies(data.Search);
				} catch (err) {
					console.log(err.message);
					setError(err.message);
				} finally {
					setIsLoading(false);
				}
			}

			if (query.length < 3) {
				setError("");
				setMovies([]);
				return;
			}

			fetchMovies();
		},
		[query]
	);

	return (
		<>
			<Navbar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</Navbar>
			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList movies={movies} onSelectMovie={handleSelectMovie} />
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					<>
						{selectedId ? (
							<MovieDetails
								selectedId={selectedId}
								onCloseMovie={handleCloseMovie}
							/>
						) : (
							<>
								<Summary watched={watched} />
								<WatchedList watched={watched} />
							</>
						)}
					</>
				</Box>
			</Main>
		</>
	);
}

function Navbar({ children }) {
	return <nav className="nav-bar">{children}</nav>;
}

function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

const KEY = "54c6f104";

function ErrorMessage({ message }) {
	return <p className="error">{message}</p>;
}
