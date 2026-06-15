#!/usr/bin/env python3
"""Generate neon-style section heading graphics (ABOUT / ROADMAP / CONTACT)."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

OUT_DIR = "/mnt/c/00_Claude_Code/06_Homepage/assets/images/brand/headings"
os.makedirs(OUT_DIR, exist_ok=True)

ACCENT = (0, 188, 255, 255)
FONT_PATH = "/usr/share/fonts/truetype/ubuntu/UbuntuSansMono[wght].ttf"

WORDS = ["ABOUT", "ROADMAP", "CONTACT"]
HEIGHT = 110
FONT_SIZE = 64
PADDING_X = 8
UNDERLINE_GAP = 14
UNDERLINE_HEIGHT = 4

for word in WORDS:
    font = ImageFont.truetype(FONT_PATH, FONT_SIZE)
    # Measure text with letter-spacing
    spacing = 14
    dummy = Image.new("RGBA", (10, 10))
    ddraw = ImageDraw.Draw(dummy)
    widths = [ddraw.textlength(ch, font=font) for ch in word]
    text_width = int(sum(widths) + spacing * (len(word) - 1))
    bbox = font.getbbox(word)
    text_height = bbox[3] - bbox[1]

    width = text_width + PADDING_X * 2
    img = Image.new("RGBA", (width, HEIGHT), (0, 0, 0, 0))

    # Glow layer
    glow = Image.new("RGBA", (width, HEIGHT), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    x = PADDING_X
    y = (HEIGHT - UNDERLINE_HEIGHT - UNDERLINE_GAP - text_height) // 2 - bbox[1]
    for ch, w in zip(word, widths):
        gdraw.text((x, y), ch, font=font, fill=ACCENT)
        x += w + spacing
    glow = glow.filter(ImageFilter.GaussianBlur(6))

    img = Image.alpha_composite(img, glow)

    # Sharp text layer
    draw = ImageDraw.Draw(img)
    x = PADDING_X
    for ch, w in zip(word, widths):
        draw.text((x, y), ch, font=font, fill=ACCENT)
        x += w + spacing

    # Underline
    underline_y = HEIGHT - UNDERLINE_HEIGHT
    draw.rectangle(
        [PADDING_X, underline_y, PADDING_X + text_width, underline_y + UNDERLINE_HEIGHT],
        fill=ACCENT,
    )

    out_path = os.path.join(OUT_DIR, f"{word.lower()}.png")
    img.save(out_path)
    print(f"saved {out_path} ({width}x{HEIGHT})")
