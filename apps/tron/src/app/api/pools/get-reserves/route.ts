import { NextResponse } from "next/server";
import { BITQUERY_ENDPOINT } from "src/bitquery/bitquery-endpoint";
import { getOptions } from "src/bitquery/bitquery-options";
import { getReserves } from "src/bitquery/queries/getReserves";

export async function GET(req: Request): Promise<NextResponse> {
	const { searchParams } = new URL(req.url);
	const pairAddresses = searchParams.get("pairAddresses");

	if (!pairAddresses) {
		return NextResponse.json({ success: false, message: "pairAddresses is required" });
	}

	try {
		const pairAddressArray = pairAddresses.split(",");
		const query = getReserves(pairAddressArray);

		const options = getOptions(query);

		const res = await fetch(BITQUERY_ENDPOINT, { ...options, next: { revalidate: 3600 } }); //TODO: change revalidate time - time in seconds - 1 hour atm
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
