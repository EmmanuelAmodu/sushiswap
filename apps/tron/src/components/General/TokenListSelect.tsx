import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	List,
	SelectIcon,
} from "@sushiswap/ui";
import { Search } from "../Input/Search";
import { useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import { IToken } from "src/types/token-type";
import { DEFAULT_TOKEN_LIST, DEFAULT_TOKEN_LIST_WITH_KEY } from "src/constants/token-list";
import { useDebounce } from "@sushiswap/hooks";
import { useTokenInfo } from "src/hooks/useTokenInfo";
import { useCustomTokens } from "src/hooks/useCustomTokens";
import { useSortedTokenList } from "src/hooks/useSortedTokenList";

export const TokenListSelect = ({
	token,
	setToken,
}: {
	token: IToken | undefined;
	setToken: (token: IToken) => void;
}) => {
	const [query, setQuery] = useState<string>("");
	const debouncedQuery = useDebounce(query, 500);
	const closeBtnRef = useRef<HTMLButtonElement>(null);
	const { data: newToken } = useTokenInfo({ tokenAddress: debouncedQuery });
	const { customTokens, addOrRemoveToken, hasToken } = useCustomTokens();
	const { data: sortedTokenList } = useSortedTokenList({
		query: debouncedQuery,
		tokenMap: DEFAULT_TOKEN_LIST_WITH_KEY(),
		customTokenMap: customTokens,
	});

	const closeModal = () => {
		closeBtnRef?.current?.click();
		setQuery("");
	};

	const selectToken = (token: IToken) => {
		setToken(token);
		closeModal();
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					icon={() => (token ? <Icon currency={token} width={22} height={22} /> : <></>)}
					size="sm"
					variant="secondary"
					className="!rounded-full flex items-center !px-2 !py-1">
					<span>{token?.symbol ?? "Select"}</span>
					<SelectIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogClose ref={closeBtnRef} />
				<DialogHeader>
					<DialogTitle>Select a token</DialogTitle>
					<DialogDescription>
						Select a token from our default list or search for a token by symbol or address.
					</DialogDescription>
				</DialogHeader>
				<div className="">
					<Search id={"token-search"} value={query} loading={false} onChange={setQuery} />
				</div>

				<div className="flex flex-col gap-4">
					<List className="!pt-0">
						<List.Control className="flex flex-col gap-2 p-1 min-h-[250px] max-h-[400px] overflow-y-auto overflow-x-hidden">
							{newToken ? (
								[newToken].map((token) => (
									<TokenButton
										token={token}
										selectToken={selectToken}
										key={token.address}
										hasToken={hasToken}
										addOrRemoveToken={addOrRemoveToken}
									/>
								))
							) : sortedTokenList?.length === 0 ? (
								<p className="text-gray-400 dark:text-slate-500 text-center pt-2">No tokens found</p>
							) : (
								sortedTokenList?.map((token) => (
									<TokenButton
										token={token}
										selectToken={selectToken}
										key={token.address}
										hasToken={hasToken}
										addOrRemoveToken={addOrRemoveToken}
									/>
								))
							)}
						</List.Control>
					</List>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const TokenButton = ({
	token,
	selectToken,
	hasToken,
	addOrRemoveToken,
}: {
	token: IToken;
	selectToken: (_token: IToken) => void;
	hasToken?: (currency: IToken) => boolean;
	addOrRemoveToken?: (type: "add" | "remove", currency: IToken[]) => void;
}) => {
	const isOnDefaultList = useMemo(() => DEFAULT_TOKEN_LIST.some((t) => t.address === token.address), [token]);
	const isNew = hasToken && !hasToken(token);
	const isCustomAdded = hasToken && hasToken(token);

	return (
		<div className="flex w-full justify-between items-center gap-2 pr-2">
			<Button
				onClick={() => selectToken(token)}
				key={token.address}
				size="xl"
				className="flex items-center justify-between w-full"
				variant="ghost">
				<div className="flex items-center gap-1 w-full">
					<Icon currency={token} height={28} width={28} />
					<div className="flex flex-col items-start">
						<p>{token.symbol}</p>
						<p className="text-xs text-gray-400 dark:text-slate-500">{token.name}</p>
					</div>
				</div>
			</Button>
			{isNew && !isOnDefaultList ? (
				<Button
					onClick={() => {
						addOrRemoveToken && addOrRemoveToken("add", [token]);
					}}
					className="z-[1]"
					size="xs">
					Import
				</Button>
			) : null}
			{isCustomAdded && !isOnDefaultList ? (
				<Button
					className="z-[1]"
					onClick={() => {
						addOrRemoveToken && addOrRemoveToken("remove", [token]);
					}}
					variant="destructive"
					size="xs">
					Remove
				</Button>
			) : null}
		</div>
	);
};
