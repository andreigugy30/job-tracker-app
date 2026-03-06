//functionality to keep state of the board
"use client";
import { useEffect, useState } from "react";
import { Board, Column } from "../models/models.types";

export function useBoard(initialBoardState?: Board | null) {
	//manage the position of the items in the board(jobs) based on a state

	const [board, setBoard] = useState<Board | null>(initialBoardState || null);
	const [columns, setColumns] = useState<Column[] | null>(
		initialBoardState?.columns || null,
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (initialBoardState) {
			setBoard(initialBoardState);
			setColumns(initialBoardState.columns || []);
		}
	}, [initialBoardState]);

	async function moveJob(
		jobApplicationId: string,
		newColumnId: string,
		newOrder: number,
	) {}

	//I'll change the values of the state and return the new state values
	return { board, columns, error, moveJob };
}
