import { NextResponse } from "next/server";
import { BITQUERY_ENDPOINT } from "src/bitquery/bitquery-endpoint";
import { getOptions } from "src/bitquery/bitquery-options";
import { getTransfersToPairs } from "src/bitquery/queries/getTransfersToPairs";

export async function GET(req: Request): Promise<NextResponse> {
	const { searchParams } = new URL(req.url);
	const pairAddresses = searchParams.get("pairAddresses");
	const walletAddress = searchParams.get("walletAddress");

	if (!pairAddresses) {
		return NextResponse.json({ success: false, message: "pairAddresses is required" });
	}

	if (!walletAddress) {
		return NextResponse.json({ success: false, message: "walletAddress is required" });
	}

	try {
		const pairAddressArray = pairAddresses.split(",");
		const query = getTransfersToPairs(pairAddressArray, walletAddress);

		const options = getOptions(query);

		const res = await fetch(BITQUERY_ENDPOINT, {
			...options,
			next: { revalidate: 3601 },
		}); //TODO: change revalidate time - time in seconds - 1 hour atm
		if (!res.ok) {
			throw new Error("Failed to fetch data from Bitquery API");
		}
		const data = await res.json();

		return NextResponse.json({ ...data });
	} catch (error) {
		console.error(error);
		return NextResponse.json(undefined);
	}
}
