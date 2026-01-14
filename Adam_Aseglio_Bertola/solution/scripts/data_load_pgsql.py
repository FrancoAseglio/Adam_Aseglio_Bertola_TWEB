import os
import sys
import pandas as pd
import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


POSTGRES_CONFIG = {
    "host"    : "localhost",
    "port"    :  5432,
    "user"    : "postgres",
    "password": "password"
}

DB_NAME    = "anime_db"
CSV_IN_DIR = os.path.expanduser("~/datasets/cleaned/")
# CSV_IN_DIR = r"C:\Users\Lorenzo\OneDrive\Desktop\datasets\cleaned"
CHUNK_SIZE = 10_000

FILES = {
    "character_anime_works_clean.csv": "character_anime_works",
    "characters_clean.csv"           : "characters",
    "details_clean.csv"              : "details",
    "person_details_clean.csv"       : "person_details",
    "person_voice_works_clean.csv"   : "person_voice_works",
}


class PostgreSQLLoader:
    def __init__(self):
        try:
            conn = psycopg2.connect(
                host     = POSTGRES_CONFIG["host"],
                port     = POSTGRES_CONFIG["port"],
                user     = POSTGRES_CONFIG["user"],
                password = POSTGRES_CONFIG["password"],
                database = "postgres"
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))

            if not cursor.fetchone():
                cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(DB_NAME)))

            cursor.close()
            conn.close()

            self.conn = psycopg2.connect(
                host     = POSTGRES_CONFIG["host"],
                port     = POSTGRES_CONFIG["port"],
                user     = POSTGRES_CONFIG["user"],
                password = POSTGRES_CONFIG["password"],
                database = DB_NAME
            )
            self.cursor = self.conn.cursor()
            print(f"✅ Connected to PostgreSQL: {DB_NAME}")

            self._create_tables()

        except Exception as e:
            print(f"❌ Failed to connect to PostgreSQL: {e}")
            sys.exit(1)


    def _create_tables(self):
        create_tables_sql = """
        DROP TABLE IF EXISTS character_anime_works CASCADE;
        CREATE TABLE character_anime_works (
            anime_mal_id INTEGER NOT NULL,
            character_mal_id INTEGER NOT NULL,
            character_name TEXT,
            role VARCHAR(50),
            PRIMARY KEY (character_mal_id, anime_mal_id)
        );

        DROP TABLE IF EXISTS characters CASCADE;
        CREATE TABLE characters (
            character_mal_id INTEGER PRIMARY KEY,
            url TEXT,
            name TEXT,
            name_kanji TEXT,
            image TEXT,
            favorites INTEGER,
            about TEXT
        );

        DROP TABLE IF EXISTS details CASCADE;
        CREATE TABLE details (
            mal_id INTEGER PRIMARY KEY,
            title TEXT,
            title_japanese TEXT,
            url TEXT,
            image_url TEXT,
            type VARCHAR(50),
            status VARCHAR(50),
            score FLOAT,
            scored_by INTEGER,
            start_date TEXT,
            end_date TEXT,
            synopsis TEXT,
            rank INTEGER,
            popularity INTEGER,
            members INTEGER,
            favorites INTEGER,
            genres TEXT,
            studios TEXT,
            themes TEXT,
            demographics TEXT,
            source TEXT,
            rating TEXT,
            episodes INTEGER,
            season TEXT,
            year INTEGER,
            producers TEXT,
            explicit_genres TEXT,
            licensors TEXT,
            streaming TEXT
        );

        DROP TABLE IF EXISTS person_details CASCADE;
        CREATE TABLE person_details (
            person_mal_id INTEGER PRIMARY KEY,
            url TEXT,
            website_url TEXT,
            image_url TEXT,
            name TEXT,
            given_name TEXT,
            family_name TEXT,
            birthday DATE,
            favorites INTEGER,
            relevant_location TEXT
        );

        DROP TABLE IF EXISTS person_voice_works CASCADE;
        CREATE TABLE person_voice_works (
            person_mal_id INTEGER NOT NULL,
            role VARCHAR(50),
            anime_mal_id INTEGER NOT NULL,
            character_mal_id INTEGER NOT NULL,
            language VARCHAR(50),
            PRIMARY KEY (person_mal_id, character_mal_id, anime_mal_id)
        );
        """

        self.cursor.execute(create_tables_sql)
        self.conn.commit()


    def load_csv(self, csv_file: str, table_name: str, limit: int | None = None, clear_existing: bool = True):
        """Load a CSV file into a PostgreSQL table using chunked inserts."""
        print(f"\n📂 Loading {csv_file} → {table_name}")

        file_path = os.path.join(CSV_IN_DIR, csv_file)
        if not os.path.exists(file_path):
            print(f"  ⚠️  File not found: {file_path}")
            return

        try:
            if clear_existing:
                self.cursor.execute(f"TRUNCATE TABLE {table_name} CASCADE")
                self.conn.commit()
                print("  🗑️  Table truncated")

            total = 0

            for chunk in pd.read_csv(file_path, chunksize=CHUNK_SIZE):
                if limit and total >= limit:
                    break

                chunk = chunk.replace([float('nan'), float('inf'), float('-inf'), 'NaN', 'nan'], None)
                chunk = chunk.where(pd.notnull(chunk), None)
                columns = chunk.columns.tolist()
                placeholders = ','.join(['%s'] * len(columns))

                if table_name == "character_anime_works":
                    on_conflict = "ON CONFLICT (character_mal_id, anime_mal_id) DO NOTHING"
                elif table_name == "characters":
                    on_conflict = "ON CONFLICT (character_mal_id) DO NOTHING"
                elif table_name == "details":
                    on_conflict = "ON CONFLICT (mal_id) DO NOTHING"
                elif table_name == "person_details":
                    on_conflict = "ON CONFLICT (person_mal_id) DO NOTHING"
                elif table_name == "person_voice_works":
                    on_conflict = "ON CONFLICT (person_mal_id, character_mal_id, anime_mal_id) DO NOTHING"
                else:
                    on_conflict = ""

                insert_query = f"INSERT INTO {table_name} ({','.join(columns)}) VALUES ({placeholders}) {on_conflict}"
                records = [tuple(row) for row in chunk.values]

                if records:
                    self.cursor.executemany(insert_query, records)
                    total += self.cursor.rowcount
                    self.conn.commit()

            print(f"  ✅ Loaded {total:,} rows")

        except Exception as e:
            print(f"  ❌ Error loading {csv_file}: {e}")


    def create_indexes(self):
        print("\n🔍 Creating indexes...")

        indexes = [
            ("character_anime_works", [("character_mal_id",)], {}),
            ("character_anime_works", [("anime_mal_id",)],     {}),
            ("character_anime_works", [("role",)],             {}),
            ("characters",            [("name",)],             {}),
            ("characters",            [("favorites",)],        {}),
            ("details",               [("title",)],            {}),
            ("details",               [("type",)],             {}),
            ("details",               [("score",)],            {}),
            ("details",               [("year",)],             {}),
            ("person_details",        [("name",)],             {}),
            ("person_details",        [("favorites",)],        {}),
            ("person_voice_works",    [("person_mal_id",)],    {}),
            ("person_voice_works",    [("character_mal_id",)], {}),
            ("person_voice_works",    [("anime_mal_id",)],     {}),
            ("person_voice_works",    [("language",)],         {}),
        ]

        for table, columns, options in indexes:
            try:
                index_name = f"idx_{'_'.join([col[0] for col in columns])}"
                columns_str = ', '.join([col[0] for col in columns])
                self.cursor.execute(f"CREATE INDEX IF NOT EXISTS {index_name} ON {table}({columns_str})")
                self.conn.commit()

            except Exception as e:
                print(f"  ⚠️  Index error on {table}: {e}")
                self.conn.rollback()

        print("  ✅ Indexing complete")


    def close(self):
        self.cursor.close()
        self.conn.close()
        print("\n✅ Connection closed")


def main():
    loader = PostgreSQLLoader()

    try:
        for csv_file, table in FILES.items():
            loader.load_csv(csv_file, table)

        loader.create_indexes()

    finally:
        loader.close()


if __name__ == "__main__":
    main()
