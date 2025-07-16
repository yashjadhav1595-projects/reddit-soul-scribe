#!/usr/bin/env python3
"""
Reddit Persona Fetcher Script
- Fetches persona for a given Reddit username from the backend API
- Saves the persona JSON to a .txt file
- Usage: python generate_persona.py <reddit_username>
"""
import argparse
import requests
import sys
import os

API_URL = "http://localhost:3001/api/analyze"


def fetch_persona(username):
    """Fetch persona for the given Reddit username from the backend API."""
    payload = {"username": username, "comprehensive": True}
    try:
        print(f"[INFO] Requesting persona for Reddit user: {username}")
        response = requests.post(API_URL, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        if not data.get("success"):
            print(f"[ERROR] API error: {data.get('error')}")
            sys.exit(1)
        persona = data["data"]["persona"]
        return persona
    except requests.RequestException as e:
        print(f"[ERROR] Request failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        sys.exit(1)


def save_persona_to_file(persona, username, html_content=None):
    """Save persona JSON to a .txt file and HTML file if provided."""
    filename = f"persona_{username}.txt"
    try:
        with open(filename, "w", encoding="utf-8") as f:
            import json
            f.write(json.dumps(persona, indent=2, ensure_ascii=False))
        print(f"[INFO] Persona saved to {filename}")
        if html_content:
            html_filename = f"persona_{username}.html"
            with open(html_filename, "w", encoding="utf-8") as f:
                f.write(html_content)
            print(f"[INFO] Persona HTML saved to {html_filename}")
    except Exception as e:
        print(f"[ERROR] Could not save persona to file: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Fetch Reddit persona and save to .txt and .html file.")
    parser.add_argument("username", help="Reddit username to analyze")
    args = parser.parse_args()
    persona = fetch_persona(args.username)
    # Try to get HTML content from backend if available
    html_content = None
    if 'personaHtmlFilePath' in persona:
        try:
            with open(persona['personaHtmlFilePath'], 'r', encoding='utf-8') as f:
                html_content = f.read()
        except Exception:
            pass
    save_persona_to_file(persona, args.username, html_content)


if __name__ == "__main__":
    main() 