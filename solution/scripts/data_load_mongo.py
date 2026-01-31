import os
import sys
import pandas as pd
from pymongo import MongoClient, errors


MONGO_URI  = "mongodb://localhost:27017/"
DB_NAME    = "anime_db"
CSV_IN_DIR = os.path.expanduser("~/datasets/cleaned/")
# CSV_IN_DIR = r"C:\Users\Lorenzo\OneDrive\Desktop\datasets\cleaned"
CHUNK_SIZE = 10_000

FILES = {
    "favs_clean.csv"           : "favorites",
    "ratings_clean.csv"        : "ratings",
    "profiles_clean.csv"       : "profiles",
    "stats_clean.csv"          : "stats",
    "recommendations_clean.csv": "recommendations",
}


class MongoDBLoader:
    def __init__(self):
        try:
            self.client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            self.db = self.client[DB_NAME]
            self.client.server_info()
            print(f"✅ Connected to MongoDB: {DB_NAME}")

        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            sys.exit(1)


    def load_csv(self, csv_file: str, collection_name: str, limit: int | None = None, clear_existing: bool = True):
        """Load a CSV file into a MongoDB collection using chunked inserts."""
        print(f"\n📁 Loading {csv_file} → {collection_name}")

        file_path = os.path.join(CSV_IN_DIR, csv_file)
        if not os.path.exists(file_path):
            print(f"  ⚠️  File not found: {file_path}")
            return

        try:
            if clear_existing:
                self.db[collection_name].drop()
                print("  🗑️  Collection dropped")

            total = 0

            for chunk in pd.read_csv(file_path, chunksize=CHUNK_SIZE):
                if limit and total >= limit:
                    break

                # NaN to None for MongoDB
                records = (chunk.where(pd.notnull(chunk), None).to_dict("records"))

                if records:
                    self.db[collection_name].insert_many(records, ordered=False)
                    total += len(records)

            print(f"  ✅ Loaded {total:,} documents")

        except Exception as e:
            print(f"  ❌ Error loading {csv_file}: {e}")


    def create_indexes(self):
        print("\n🔍 Creating indexes...")

        indexes = [
            ("favorites",       [("username", 1)], {}),
            ("favorites",       [("username", 1), ("id", 1)], {"unique": True}),
            ("ratings",         [("username", 1)], {}),
            ("ratings",         [("username", 1), ("anime_id", 1)], {"unique": True}),
            ("profiles",        [("username", 1)], {"unique": True}),
            ("stats",           [("mal_id",   1)], {"unique": True}),
            ("recommendations", [("mal_id",   1)], {}),
            ("recommendations", [("mal_id",   1), ("recommendation_mal_id", 1)], {}),
        ]

        for collection, keys, options in indexes:
            try:
                self.db[collection].create_index(keys, **options)

            except errors.OperationFailure as e:
                if "already exists" not in str(e):
                    print(f"  ⚠️  Index error on {collection}: {e}")

        print("  ✅ Indexing complete")


    def close(self):
        self.client.close()
        print("\n✅ Connection closed")


def main():
    loader = MongoDBLoader()

    try:
        for csv_file, collection in FILES.items():
            loader.load_csv(csv_file, collection)

        loader.create_indexes()

    finally:
        loader.close()


if __name__ == "__main__":
    main()
