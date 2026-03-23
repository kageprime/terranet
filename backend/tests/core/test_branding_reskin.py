from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def _read(relative_path: str) -> str:
    return (ROOT / relative_path).read_text(encoding="utf-8")


def test_core_prompts_use_dosco_live_branding():
    core_prompt = _read("core/prompts/core_prompt.py")
    memory_prompt = _read("core/prompts/memory_extraction_prompt.py")

    assert "Dosco.live" in core_prompt
    assert "Dosco.live" in memory_prompt
    assert "You are Kortix" not in core_prompt
    assert "You are Kortix" not in memory_prompt


def test_openapi_and_cors_use_dosco_domains():
    openapi_config = _read("core/utils/openapi_config.py")
    api_module = _read("api.py")

    assert "api.dosco.live" in openapi_config
    assert "dosco.live/settings/api-keys" in openapi_config
    assert "dosco.live" in api_module
    assert "kortix.com" not in api_module


def test_supabase_auth_email_templates_use_dosco_branding():
    template_paths = [
        "supabase/emails/auth/change_email.html",
        "supabase/emails/auth/confirm_sign_up.html",
        "supabase/emails/auth/invite_user.html",
        "supabase/emails/auth/magic_link.html",
        "supabase/emails/auth/reauthentication.html",
        "supabase/emails/auth/reset_password.html",
    ]

    for path in template_paths:
        content = _read(path)
        assert "Dosco.live" in content
        assert "kortix.com" not in content
