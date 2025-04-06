import shortuuid
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import errors

import config


db_host = config.DB_HOST
db_user = config.DB_USER
db_pass = config.DB_PASS
db_cluster = config.DB_CLUSTER
client = config.DB_NAME
collection = config.DB_COLLECTION

# Build the connection URI based on whether it's Atlas or local MongoDB
if db_cluster:
    MONGODB_URI = f"mongodb+srv://{db_user}:{db_pass}@{db_host}/?retryWrites=true&w=majority&appName={db_cluster}"
else:
    MONGODB_URI = (
        f"mongodb://{db_user}:{db_pass}@{db_host}/?retryWrites=true&w=majority"
    )


class DBHandler:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DBHandler, cls).__new__(cls)
        return cls._instance

    async def initialize(self):
        if hasattr(self, "initialized") and self.initialized:
            return

        try:
            self.client = AsyncIOMotorClient(MONGODB_URI)
            self.db_client = self.client[client]
            self.collection_name = collection
            self.initialized = True
            print("Successfully connected to MongoDB")
        except errors.ConfigurationError as e:
            print(f"ConfigurationError: {e}")
        except errors.ConnectionFailure as e:
            print(f"ConnectionFailure: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

    async def create(self, title, desc, code, theme, lang, time):
        try:
            collection = self.db_client[self.collection_name]

            custom_alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/"
            shortuuid.set_alphabet(custom_alpha)

            slug = shortuuid.ShortUUID().random(length=9)

            # doc = await collection.find_one({"slug": slug})
            doc = await collection.find_one({"code": code})

            if not doc:
                data = {
                    "title": title,
                    "description": desc,
                    "code": code,
                    "theme": theme,
                    "language": lang,
                    "time": time,
                    "clicks": 0,
                    "slug": slug,
                }
                await collection.insert_one(data)
                return True, slug

            return False, None

        except Exception as e:
            print(f"Error inserting data: {e}")
            return False, None

    async def info(self, slug):
        try:
            collection = self.db_client[self.collection_name]
            doc = await collection.find_one({"slug": slug})

            if doc:
                await collection.update_one({"slug": slug}, {"$inc": {"clicks": 1}})
                data = {
                    "name": doc.get("slug", ""),
                    "code": doc.get("code", ""),
                    "clicks": doc.get("clicks", 0),
                    "title": doc.get("title", ""),
                    "description": doc.get("description", ""),
                    "language": doc.get("language", ""),
                    "theme": doc.get("theme", ""),
                }
                return True, data
            return False, None

        except Exception as e:
            print(f"Error fetching data: {e}")
            return False, None
