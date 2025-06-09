from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_supabase() -> Client:
    url = "https://aeghwonjskklbwufmgbw.supabase.co"
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not key:
        raise Exception("SUPABASE_SERVICE_KEY environment variable not found")
    return create_client(url, key)


class TranslationValue(BaseModel):
    value: str
    updated_at: str
    updated_by: str


class TranslationKey(BaseModel):
    id: str
    key: str
    category: str
    description: Optional[str] = None
    translations: Dict[str, TranslationValue]


class CreateTranslationKey(BaseModel):
    key: str
    category: str
    description: Optional[str] = None
    translations: Dict[str, TranslationValue]


class UpdateTranslationKey(BaseModel):
    key: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    translations: Optional[Dict[str, TranslationValue]] = None


class BulkUpdateRequest(BaseModel):
    updates: List[Dict[str, Any]]


class Project(BaseModel):
    id: str
    name: str
    description: Optional[str] = None


class Language(BaseModel):
    code: str
    name: str
    is_default: bool = False


@app.get("/localizations/{project_id}/{locale}")
async def get_localizations(
    project_id: str, locale: str, supabase: Client = Depends(get_supabase)
):
    keys_response = (
        supabase.table("translation_keys")
        .select("*")
        .eq("project_id", project_id)
        .execute()
    )

    if not keys_response.data:
        return {"project_id": project_id, "locale": locale, "localizations": {}}

    localizations = {}
    for key_data in keys_response.data:
        translation_response = (
            supabase.table("translation_values")
            .select("value")
            .eq("translation_key_id", key_data["id"])
            .eq("language_code", locale)
            .execute()
        )

        if translation_response.data:
            localizations[key_data["key"]] = translation_response.data[0]["value"]

    return {"project_id": project_id, "locale": locale, "localizations": localizations}


@app.get("/translation-keys", response_model=List[TranslationKey])
async def get_translation_keys(
    project_id: Optional[str] = None, supabase: Client = Depends(get_supabase)
):
    query = supabase.table("translation_keys").select("*, translation_values(*)")

    if project_id:
        query = query.eq("project_id", project_id)

    response = query.execute()

    result = []
    for item in response.data:
        translations = {}
        for trans in item.get("translation_values", []):
            translations[trans["language_code"]] = TranslationValue(
                value=trans["value"],
                updated_at=trans["updated_at"],
                updated_by=trans["updated_by"],
            )

        result.append(
            TranslationKey(
                id=item["id"],
                key=item["key"],
                category=item["category"],
                description=item.get("description"),
                translations=translations,
            )
        )

    return result


@app.get("/translation-keys/{key_id}", response_model=TranslationKey)
async def get_translation_key(key_id: str, supabase: Client = Depends(get_supabase)):
    response = (
        supabase.table("translation_keys")
        .select("*, translation_values(*)")
        .eq("id", key_id)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Translation key not found")

    item = response.data
    translations = {}
    for trans in item.get("translation_values", []):
        translations[trans["language_code"]] = TranslationValue(
            value=trans["value"],
            updated_at=trans["updated_at"],
            updated_by=trans["updated_by"],
        )

    return TranslationKey(
        id=item["id"],
        key=item["key"],
        category=item["category"],
        description=item.get("description"),
        translations=translations,
    )


@app.post("/translation-keys", response_model=TranslationKey)
async def create_translation_key(
    key_data: CreateTranslationKey, supabase: Client = Depends(get_supabase)
):
    key_response = (
        supabase.table("translation_keys")
        .insert(
            {
                "key": key_data.key,
                "category": key_data.category,
                "description": key_data.description,
            }
        )
        .execute()
    )

    if not key_response.data:
        raise HTTPException(status_code=400, detail="Failed to create translation key")

    key_id = key_response.data[0]["id"]

    if key_data.translations:
        translation_inserts = []
        for lang_code, translation in key_data.translations.items():
            translation_inserts.append(
                {
                    "translation_key_id": key_id,
                    "language_code": lang_code,
                    "value": translation.value,
                    "updated_by": translation.updated_by,
                }
            )

        supabase.table("translation_values").insert(translation_inserts).execute()

    return await get_translation_key(key_id, supabase)


@app.put("/translation-keys/{key_id}")
async def update_translation_key(
    key_id: str, updates: UpdateTranslationKey, supabase: Client = Depends(get_supabase)
):
    if updates.key or updates.category or updates.description is not None:
        update_data = {}
        if updates.key:
            update_data["key"] = updates.key
        if updates.category:
            update_data["category"] = updates.category
        if updates.description is not None:
            update_data["description"] = updates.description

        supabase.table("translation_keys").update(update_data).eq(
            "id", key_id
        ).execute()

    if updates.translations:
        for lang_code, translation in updates.translations.items():
            supabase.table("translation_values").upsert(
                {
                    "translation_key_id": key_id,
                    "language_code": lang_code,
                    "value": translation.value,
                    "updated_by": translation.updated_by,
                }
            ).execute()

    return {"message": "Translation key updated successfully"}


@app.delete("/translation-keys/{key_id}")
async def delete_translation_key(key_id: str, supabase: Client = Depends(get_supabase)):
    supabase.table("translation_keys").delete().eq("id", key_id).execute()
    return {"message": "Translation key deleted successfully"}


@app.post("/translation-keys/bulk-update")
async def bulk_update_translations(
    request: BulkUpdateRequest, supabase: Client = Depends(get_supabase)
):
    upserts = []
    for update in request.updates:
        upserts.append(
            {
                "translation_key_id": update["keyId"],
                "language_code": update["languageCode"],
                "value": update["value"],
                "updated_by": update["updatedBy"],
            }
        )

    supabase.table("translation_values").upsert(upserts).execute()
    return {"message": f"Successfully updated {len(upserts)} translations"}


@app.get("/projects", response_model=List[Project])
async def get_projects(supabase: Client = Depends(get_supabase)):
    response = supabase.table("projects").select("*").order("name").execute()
    return [Project(**item) for item in response.data]


@app.get("/languages", response_model=List[Language])
async def get_languages(supabase: Client = Depends(get_supabase)):
    response = supabase.table("languages").select("*").order("name").execute()
    return [Language(**item) for item in response.data]


@app.get("/analytics/completion")
async def get_completion_analytics(
    project_id: Optional[str] = None, supabase: Client = Depends(get_supabase)
):
    languages_response = supabase.table("languages").select("code").execute()
    language_codes = [lang["code"] for lang in languages_response.data]

    keys_query = supabase.table("translation_keys").select("id")
    if project_id:
        keys_query = keys_query.eq("project_id", project_id)

    keys_response = keys_query.execute()
    total_keys = len(keys_response.data)

    if total_keys == 0:
        return {"total_keys": 0, "completion_by_language": {}}

    completion_stats = {}
    for lang_code in language_codes:
        translations_response = (
            supabase.table("translation_values")
            .select("translation_key_id")
            .eq("language_code", lang_code)
            .execute()
        )

        if project_id:
            key_ids = [key["id"] for key in keys_response.data]
            translated_count = len(
                [
                    t
                    for t in translations_response.data
                    if t["translation_key_id"] in key_ids
                ]
            )
        else:
            translated_count = len(translations_response.data)

        completion_percentage = (
            (translated_count / total_keys) * 100 if total_keys > 0 else 0
        )
        completion_stats[lang_code] = {
            "translated": translated_count,
            "total": total_keys,
            "percentage": round(completion_percentage, 2),
        }

    return {"total_keys": total_keys, "completion_by_language": completion_stats}
