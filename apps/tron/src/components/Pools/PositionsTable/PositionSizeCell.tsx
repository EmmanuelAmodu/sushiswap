import { IMyPositionData } from "src/types/get-pools-type";
import { formatPercent } from "sushi/format";
import { usePoolOwnership } from "../../../hooks/usePoolOwnership";

export const PositionSizeCell = ({ data }: { data: IMyPositionData }) => {
	const { pairAddress } = data;
	const { data: ownership } = usePoolOwnership({ pairAddress });

	return (
		<div className="flex items-center gap-1">
			<div className="flex flex-col gap-0.5">
				<span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
					{formatPercent(ownership)}
				</span>
			</div>
		</div>
	);
};
