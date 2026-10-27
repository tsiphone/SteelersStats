import requests
import pandas as pd

def fetch_and_clean_steelers(team_id=23, team_name="Pittsburgh Steelers"):
    url = "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/types/2/teams/23/statistics"
    headers = {"User-Agent": "Mozilla/5.0"}
    print("Connecting with API ESPN....")
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Error in petition, Code {response.status_code}")
        return pd.DataFrame()

    data = response.json()

    categories = data.get("splits", {}).get("categories", [])
   
    records = []

    for cat in categories:
        cat_name = cat.get("name", "general")
        for stat in cat.get("stats", []):
            records.append({
                "team": team_name,
                "team_id": team_id,
                "category": cat_name,
                "metrics": stat.get("name"),
                "label": stat.get("displayName"),
                "value": float(stat.get("value", 0)),
                "display_value": stat.get("displayValue")
            })
    
    return pd.DataFrame(records)


if __name__ == "__main__":
    df = fetch_and_clean_steelers(23, "Pittsburgh Steelers")
    if not df.empty:
        csv_filename = "steelers_stats.csv"
        df.to_csv(csv_filename, index=False, encoding="utf-8")
        print(df[["category", "label", "display_value"]].head())