import { Collection, MongoClient } from "mongodb";

type ResolveFunction = () => void;

// Mutex class to ensure sequential execution
class Mutex {
	taken = false;
	resolves: ResolveFunction[] = [];

	async takeTurn(): Promise<void> {
		if (!this.taken) {
			this.taken = true;
			return;
		}
		return new Promise((res) => this.resolves.push(res));
	}

	returnTurn() {
		const res = this.resolves.shift();
		if (res === undefined) {
			this.taken = false;
		} else {
			res();
		}
	}
}

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const client: MongoClient = new MongoClient(dbUrl);

export class PermanentCache<CacheRecord> {
	private _isConnected = false;
	private _collection?: Collection;
	private lock: Mutex = new Mutex();
	private dbName: string;
	private collectionName: string;
	private cacheReadOnly: boolean;

	constructor(cacheReadOnly: boolean, dbName: string, collectionName: string) {
		// remove all special characters from the database and collection names
		this.cacheReadOnly = cacheReadOnly;
		this.dbName = dbName.replace(/[^a-zA-Z0-9]/g, "");
		this.collectionName = collectionName.replace(/[^a-zA-Z0-9]/g, "");
		console.log(`Database: ${this.dbName}, Collection: ${this.collectionName}`);
		client.on("open", () => {
			this._isConnected = true;
		});

		client.on("close", () => {
			this._isConnected = false;
		});
	}

	// Ensure MongoDB connection and collection are initialized
	private async initializeMongoClient() {
		if (!this._isConnected) {
			await client.connect();
		}
		const db = client.db(this.dbName);
		this._collection = db.collection(this.collectionName);
	}

	private async ensureConnection() {
		if (!this._collection) {
			await this.initializeMongoClient();
		}
	}

	get collection() {
		return this._collection;
	}

	get isConnected() {
		return this._isConnected;
	}

	// Get all records from the collection
	async getAllRecords(): Promise<CacheRecord[]> {
		await this.ensureConnection();

		await this.lock.takeTurn();
		try {
			const records = await this._collection?.find({}).toArray();
			return records as CacheRecord[];
		} finally {
			this.lock.returnTurn();
		}
	}

	async getSomeRecords({
		query = {},
		skip = 0,
		limit = 5,
	}: { limit?: number; query?: object; skip?: number } = {}): Promise<
		CacheRecord[]
	> {
		await this.ensureConnection();

		await this.lock.takeTurn();
		try {
			const records = await this._collection
				?.find(query)
				.limit(limit)
				.skip(skip)
				.toArray();
			return records as CacheRecord[];
		} finally {
			this.lock.returnTurn();
		}
	}

	// Add a new record to the collection
	async add(record: CacheRecord) {
		// if (!this.cacheReadOnly) {
		// 	throw new Error("Cache is read only");
		// }

		await this.ensureConnection();

		await this.lock.takeTurn();
		try {
			await this._collection?.insertOne(
				record as unknown as Record<string, unknown>,
			);
		} finally {
			this.lock.returnTurn();
		}
	}

	async connect() {
		if (!this._isConnected) {
			await client.connect();
		}
	}

	// Close MongoDB client connection
	async close() {
		await client.close();
	}
}
