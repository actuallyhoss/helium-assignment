import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from src.localization_management_api.main import app

client = TestClient(app)

@pytest.fixture
def mock_supabase():
    with patch('src.localization_management_api.main.get_supabase') as mock:
        supabase_mock = Mock()
        mock.return_value = supabase_mock
        yield supabase_mock

def test_get_localizations_empty_project(mock_supabase):
    # Mock empty response
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
    
    response = client.get("/localizations/test-project/en")
    
    assert response.status_code == 200
    data = response.json()
    assert data["project_id"] == "test-project"
    assert data["locale"] == "en"
    assert data["localizations"] == {}

def test_get_localizations_with_data(mock_supabase):
    # Mock translation keys response
    keys_data = [{"id": "key1", "key": "greeting"}]
    translation_data = [{"value": "Hello"}]
    
    # Setup mock chain
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = keys_data
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = translation_data
    
    response = client.get("/localizations/test-project/en")
    
    assert response.status_code == 200
    data = response.json()
    assert data["localizations"]["greeting"] == "Hello"

def test_get_translation_keys(mock_supabase):
    # Mock response data
    mock_data = [{
        "id": "1",
        "key": "test.key",
        "category": "test",
        "description": "Test key",
        "translation_values": [{
            "language_code": "en",
            "value": "Test value",
            "updated_at": "2023-01-01T00:00:00Z",
            "updated_by": "test-user"
        }]
    }]
    
    mock_supabase.table.return_value.select.return_value.execute.return_value.data = mock_data
    
    response = client.get("/translation-keys")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["key"] == "test.key"
    assert data[0]["translations"]["en"]["value"] == "Test value"

def test_get_translation_key_not_found(mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = None
    
    response = client.get("/translation-keys/nonexistent")
    
    assert response.status_code == 404

def test_create_translation_key(mock_supabase):
    # Mock successful creation
    mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [{"id": "new-key-id"}]
    
    # Mock the get_translation_key call
    mock_data = {
        "id": "new-key-id",
        "key": "new.key",
        "category": "test",
        "description": "New key",
        "translation_values": []
    }
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = mock_data
    
    new_key = {
        "key": "new.key",
        "category": "test",
        "description": "New key",
        "translations": {}
    }
    
    response = client.post("/translation-keys", json=new_key)
    
    assert response.status_code == 200
    data = response.json()
    assert data["key"] == "new.key"

def test_bulk_update_translations(mock_supabase):
    mock_supabase.table.return_value.upsert.return_value.execute.return_value = Mock()
    
    bulk_update = {
        "updates": [
            {
                "keyId": "key1",
                "languageCode": "en",
                "value": "Updated value",
                "updatedBy": "test-user"
            }
        ]
    }
    
    response = client.post("/translation-keys/bulk-update", json=bulk_update)
    
    assert response.status_code == 200
    data = response.json()
    assert "Successfully updated 1 translations" in data["message"]

def test_get_projects(mock_supabase):
    mock_data = [
        {"id": "1", "name": "Project 1", "description": "First project"},
        {"id": "2", "name": "Project 2", "description": None}
    ]
    
    mock_supabase.table.return_value.select.return_value.order.return_value.execute.return_value.data = mock_data
    
    response = client.get("/projects")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Project 1"

def test_get_languages(mock_supabase):
    mock_data = [
        {"code": "en", "name": "English", "is_default": True},
        {"code": "es", "name": "Spanish", "is_default": False}
    ]
    
    mock_supabase.table.return_value.select.return_value.order.return_value.execute.return_value.data = mock_data
    
    response = client.get("/languages")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["code"] == "en"
    assert data[0]["is_default"] is True

def test_get_completion_analytics(mock_supabase):
    # Mock languages
    languages_data = [{"code": "en"}, {"code": "es"}]
    
    # Mock translation keys
    keys_data = [{"id": "key1"}, {"id": "key2"}]
    
    # Mock translation values
    translations_data = [{"translation_key_id": "key1"}]
    
    # Setup mock responses
    mock_supabase.table.return_value.select.return_value.execute.return_value.data = languages_data
    mock_supabase.table.return_value.select.return_value.execute.return_value.data = keys_data
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = translations_data
    
    response = client.get("/analytics/completion")
    
    assert response.status_code == 200
    data = response.json()
    assert "total_keys" in data
    assert "completion_by_language" in data 