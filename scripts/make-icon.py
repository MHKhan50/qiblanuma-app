# Draws the app icon: Seljuk eight-pointed star, mihrab, Ottoman crescent and a meem.
# Usage: python3 scripts/make-icon.py   (needs Pillow)
import math
import os
from PIL import Image, ImageDraw, ImageFont

# Any font with a clear Naskh meem; FreeSerif (GNU FreeFont) was used for the shipped icon.
FONT = os.environ.get('MEEM_FONT', '/usr/share/fonts/truetype/freefont/FreeSerif.ttf')

GOLD = (176, 138, 62, 255); TEAL = (14, 110, 110, 255); CREAM = (246, 243, 236, 255)
MEEM = (246, 243, 236, 225)


def meem_layer(n, cx, cy, height, stretch):
    font = ImageFont.truetype(FONT, int(height))
    g = Image.new('RGBA', (int(height * 2), int(height * 2)), (0, 0, 0, 0))
    ImageDraw.Draw(g).text((height * 0.5, height * 0.3), 'م', font=font, fill=MEEM)
    g = g.crop(g.getbbox())
    g = g.resize((g.width, int(g.height * stretch)), Image.LANCZOS)
    layer = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    layer.paste(g, (int(cx - g.width / 2), int(cy - g.height / 2)), g)
    return layer


def emblem(size, bg):
    S = 4; n = size * S
    img = Image.new('RGBA', (n, n), bg)
    d = ImageDraw.Draw(img)
    c = n / 2; r = n * 0.37
    sq = lambda a, rad: [(c + rad * math.cos(math.radians(a + 45 + 90 * i)), c + rad * math.sin(math.radians(a + 45 + 90 * i))) for i in range(4)]
    for a in (0, 45): d.polygon(sq(a, r), fill=GOLD)
    for a in (0, 45): d.polygon(sq(a, r * 0.84), fill=TEAL if bg[3] else (0, 0, 0, 0))

    def arch(w, ys, ybot, fill):
        x0 = c - w / 2; x1 = c + w / 2; pts = [(x0, ybot), (x0, ys)]
        for k in range(31):
            t = math.radians(180 - 60 * k / 30); pts.append((x1 + w * math.cos(t), ys - w * math.sin(t)))
        for k in range(31):
            t = math.radians(60 - 60 * k / 30); pts.append((x0 + w * math.cos(t), ys - w * math.sin(t)))
        pts += [(x1, ys), (x1, ybot)]; d.polygon(pts, fill=fill)

    w = n * 0.26; ys = c; ybot = c + n * 0.19
    arch(w, ys, ybot, CREAM); arch(w * 0.72, ys + n * 0.015, ybot, TEAL)

    # Ottoman crescent, opening to the right
    cy = c + n * 0.06; R = n * 0.078; off = R * 0.36; r2 = R * 0.80
    layer = Image.new('RGBA', (n, n), (0, 0, 0, 0)); ld = ImageDraw.Draw(layer)
    ld.ellipse([c - R, cy - R, c + R, cy + R], fill=GOLD)
    mask = Image.new('L', (n, n), 0); ImageDraw.Draw(mask).ellipse([c - r2 + off, cy - r2, c + r2 + off, cy + r2], fill=255)
    layer.paste((0, 0, 0, 0), (0, 0), mask)
    img = Image.alpha_composite(img, layer)

    # Meem from a Naskh font, slightly lengthened, in the crescent's hollow
    img = Image.alpha_composite(img, meem_layer(n, c + off * 1.05, cy + n * 0.005, n * 0.13, 1.2))
    return img.resize((size, size), Image.LANCZOS)


if __name__ == '__main__':
    emblem(1024, TEAL).convert('RGB').save('assets/icon.png')
    emblem(1024, (0, 0, 0, 0)).save('assets/adaptive-icon.png')
    emblem(1024, CREAM).save('assets/splash-icon.png')
    print('assets/icon.png, adaptive-icon.png and splash-icon.png written')
