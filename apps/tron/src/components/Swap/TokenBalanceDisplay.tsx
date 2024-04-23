import { classNames } from "@sushiswap/ui";
import { WalletIcon } from "@sushiswap/ui/components/icons";
import { SkeletonText } from "@sushiswap/ui/components/skeleton";
import { useMemo } from "react";
import { Fraction } from "sushi/math";

type TokenBalanceDisplayProps = {
	amount: number;
	isLoading: boolean;
	decimals: number;
	maxAmount?: () => void;
	type: "input" | "output";
};

export const TokenBalanceDisplay = ({
	amount,
	isLoading,
	decimals,
	maxAmount,
	type,
}: TokenBalanceDisplayProps) => {
	const [big, portion] = useMemo(
		() => (amount ? `${new Fraction(amount, 10 ** decimals).toSignificant(6)}` : "0.00").split("."),
		[amount, decimals]
	);

	return (
		<button
			id="swap-from-balance-button"
			testdata-id="swap-from-balance-button"
			type="button"
			onClick={maxAmount}
			className={classNames(
				type === "input"
					? "text-blue hover:text-blue-600 active:text-blue-700 hover:dark:text-slate-300"
					: "text-gray-500 dark:text-slate-500",
				`font-medium flex gap-1.5 items-center py-1 dark:text-slate-400 px-2 rounded-md`
			)}>
			<WalletIcon width={18} height={18} />
			{isLoading ? (
				<div className="w-[60px] flex items-center">
					<SkeletonText fontSize="text-lg" className="w-full" />
				</div>
			) : (
				<span className="text-lg">
					{big}.<span className="text-sm font-semibold">{portion ?? "00"}</span>
				</span>
			)}
		</button>
	);
};
