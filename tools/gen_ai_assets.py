"""Generate the deck's illustrations with the OpenAI image API.

  export OPENAI_API_KEY=...        (or put OPENAI_API_KEY=... in a .env file at the repo root; .env is git-ignored)
  python3 tools/gen_ai_assets.py            # everything not yet generated
  python3 tools/gen_ai_assets.py hook-house # one asset

Images land in public/assets/ai/<name>.png. Nothing is sent but the prompts below.
"""
import base64, json, os, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets" / "ai"

# One shared style so every picture belongs to the same deck.
STYLE = (
    "Soft 3D clay-style illustration for a school lesson, rounded friendly shapes, matte finish, "
    "warm lantern lighting at night. Palette: deep plum-indigo background (#1A1530), antique gold (#E3B866), "
    "dusty rose (#D9A093), sage green (#A9C58B), soft teal (#6EC5C0), cream (#F6EEDD). "
    "Islamic geometric star ornament as subtle decoration. Calm, respectful, not bright. "
    "No people, no faces, no hands, no text, no letters, no logos."
)
ASSETS = {
    # name: (size, transparent background?, prompt)
    "hook-house": ("1536x1024", False, "A small humble old Arabian mud-brick house at night with one glowing window, a clay oil lamp on the doorstep, a hand mill and a woven mat beside the door, palm tree and starry sky behind. Peaceful and dignified."),
    "hook-timeline": ("1536x1024", False, "A winding path of glowing stepping stones leading back through a starry desert night toward a distant warm light, each stone marked with a small eight-pointed star. Sense of travelling back in time."),
    "detective-desk": ("1536x1024", False, "A detective's desk seen from above: a closed case folder with an eight-pointed star seal, a brass magnifying glass, a smartphone lying face up with a blank glowing screen, sticky notes, a small brass lantern."),
    "phone-frame": ("1024x1536", True, "A single modern smartphone standing upright, front view, blank dark screen, thin gold rim. Isolated object."),
    "case-file": ("1024x1024", True, "A thick paper case folder tied with string, with a round wax seal in the shape of an eight-pointed star. Isolated object."),
    "right-keeping-good": ("1024x1024", True, "Two interlocking gold rings resting on a small cushion with a sprig of olive leaves, symbol of staying together in kindness. Isolated object."),
    "right-secrets": ("1024x1024", True, "A small ornate wooden chest closed with a brass padlock, a key beside it, symbol of keeping secrets safe. Isolated object."),
    "right-empathy": ("1024x1024", True, "Two small lanterns leaning toward each other sharing one warm glow, a little heart-shaped light between them, symbol of sharing feelings. Isolated object."),
    "right-chastity": ("1024x1024", True, "A cosy house-shaped lantern with a closed arched door and a warm light inside, protected by a soft glowing shield, symbol of a protected home. Isolated object."),
    "right-parents": ("1024x1024", True, "Two elderly-style armchairs side by side with a folded shawl and a tea tray with a small brass teapot between them, warm and honouring, symbol of respecting parents. Isolated object."),
    "right-children": ("1024x1024", True, "A young olive sapling in a clay pot being supported by two wooden stakes tied gently on both sides, with a small watering can, symbol of raising children together. Isolated object."),
    "right-inheritance": ("1024x1024", True, "A rolled parchment scroll with a ribbon next to small brass balance scales holding equal little coin stacks, symbol of fair inheritance. Isolated object."),
    "courtroom": ("1536x1024", False, "An empty friendly courtroom: a wooden judge's bench with brass balance scales and a gavel, two side desks, arched windows with Islamic geometric screens, lantern light."),
    "scales": ("1024x1024", True, "Brass balance scales, perfectly level, with an eight-pointed star on the centre post. Isolated object."),
    "ai-helper": ("1024x1024", True, "A small friendly round robot holding a glowing light bulb, looking curious. Isolated object."),
    "summary-tree": ("1536x1024", False, "A young olive tree with four large glowing fruit-like lanterns hanging from its branches, in gold, rose, sage and teal, standing in a calm courtyard at night."),
    "thanks": ("1536x1024", False, "A row of hanging brass lanterns of different sizes glowing warmly against a starry plum night sky, with a crescent moon."),
}


def key():
    k = os.environ.get("OPENAI_API_KEY")
    env = ROOT / ".env"
    if not k and env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("OPENAI_API_KEY="):
                k = line.split("=", 1)[1].strip().strip('"')
    if not k:
        sys.exit("No OPENAI_API_KEY found (environment or .env).")
    return k


def generate(name, k):
    size, transparent, prompt = ASSETS[name]
    body = {"model": "gpt-image-1", "prompt": f"{prompt} {STYLE}", "size": size, "quality": "high", "n": 1}
    if transparent:
        body["background"] = "transparent"
    r = subprocess.run(
        ["curl", "-sS", "--max-time", "300", "https://api.openai.com/v1/images/generations", "-H", f"Authorization: Bearer {k}", "-H", "Content-Type: application/json", "-d", json.dumps(body)],
        capture_output=True, text=True,
    )
    data = json.loads(r.stdout or "{}")
    if "data" not in data:
        print(f"{name}: FAILED {data.get('error', {}).get('message', r.stderr[:200])}")
        return
    (OUT / f"{name}.png").write_bytes(base64.b64decode(data["data"][0]["b64_json"]))
    print(f"{name}: ok")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    k = key()
    for name in sys.argv[1:] or [n for n in ASSETS if not (OUT / f"{n}.png").exists()]:
        generate(name, k)
