import { DataTable } from "@sushiswap/ui";
import { POSITION_NAME_COLUMN, SIZE_COLUMN, TVL_COLUMN } from "./PositionColumns";
import { useMyPositions } from "src/hooks/useMyPositions";
import { useMemo, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useDebounce } from "@sushiswap/hooks";
import { IMyPositionData } from "src/types/get-pools-type";
import { IToken } from "src/types/token-type";

type PositionsTableProps = {
	query: string;
};

export type IPositionRowData = {
	token0: IToken;
	token1: IToken;
	pairAddress: string;
	reserve0: string;
	reserve1: string;
};

export const PositionsTable = ({ query }: PositionsTableProps) => {
	const [paginationState, setPaginationState] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const debouncedQuery = useDebounce(query, 250);
	const { data, isLoading } = useMyPositions();

	const filteredData = useMemo(() => {
		if (!data) return [];
		if (!debouncedQuery) return data;
		const lowercasedQuery = debouncedQuery.toLowerCase();

		return data.filter((pool) => {
			const poolValues = [
				pool.pairAddress,
				pool.token0?.address,
				pool.token1?.address,
				pool.token0?.symbol,
				pool.token1?.symbol,
				pool.token0?.name,
				pool.token1?.name,
			];

			return poolValues.some((value) => value?.toLowerCase().includes(lowercasedQuery));
		});
	}, [data, debouncedQuery]);
	return (
		<DataTable
			loading={isLoading}
			data={
				filteredData?.map((pool) => ({
					token0: pool?.token0,
					token1: pool?.token1,
					pairAddress: pool?.pairAddress,
					reserve0: pool?.reserve0,
					reserve1: pool?.reserve1,
				})) ?? []
			}
			columns={[POSITION_NAME_COLUMN, TVL_COLUMN, SIZE_COLUMN]}
			linkFormatter={(data: IMyPositionData) => {
				const token0 = data?.token0?.address;
				const token1 = data?.token1?.address;
				return `/pool/${token0}:${token1}:${data?.pairAddress}`;
			}}
			externalLink={false}
			pagination={true}
			state={{
				pagination: paginationState,
			}}
			onPaginationChange={setPaginationState}
		/>
	);
};
