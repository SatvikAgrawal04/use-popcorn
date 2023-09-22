import React from "react";
import { useState, useEffect } from "react";
import StarRating from "/home/satvik/React/use-popcorn/src/StarRating.js";
import Loader from "./Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function MovieDetails({ selectedId, onCloseMovie }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	useEffect(
		function () {
			async function getMovieDetails() {
				setIsLoading(true);
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
				);
				const data = await res.json();
				setMovie(data);
				setIsLoading(false);
			}
			getMovieDetails();
		},
		[selectedId]
	);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onCloseMovie}>
							<ArrowBackIcon />
						</button>
						<img src={poster} alt={`Poster of ${title} movie`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDB Rating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							<StarRating maxRating={10} size={25} />
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>
							<strong>Starring</strong> {actors}
						</p>
						<p>
							<strong>Directed By</strong> {director}
						</p>
					</section>
				</>
			)}
		</div>
	);
}

const KEY = "54c6f104";
