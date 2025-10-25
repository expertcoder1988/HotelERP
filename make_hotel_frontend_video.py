#!/usr/bin/env python3
import os
import sys
from typing import List, Tuple

from PIL import Image, ImageDraw, ImageFont
import subprocess
import shlex
import tempfile

# MoviePy for video assembly
try:
    from moviepy.editor import ImageClip, concatenate_videoclips
except Exception:
    ImageClip = None
    concatenate_videoclips = None

# imageio-ffmpeg for bundled ffmpeg executable fallback
try:
    import imageio_ffmpeg
except Exception:
    imageio_ffmpeg = None


WIDTH, HEIGHT = 1920, 1080
MARGIN_X = 120
TITLE_Y = 120
CONTENT_TOP_Y = 260
LINE_SPACING = 14
SLIDE_SECONDS = 3.5
FPS = 30
OUTPUT_PATH = os.path.abspath(os.path.join(os.getcwd(), "hotel_frontend_hms.mp4"))
SLIDES_DIR = os.path.abspath(os.path.join(os.getcwd(), "slides"))


def ensure_dirs() -> None:
    os.makedirs(SLIDES_DIR, exist_ok=True)


def find_font_candidate(names: List[str]) -> str:
    """Try to locate a reasonable TTF font on Linux environments."""
    candidates = []
    # Common Linux font locations
    for name in names:
        candidates.extend([
            f"/usr/share/fonts/truetype/dejavu/{name}",
            f"/usr/share/fonts/truetype/{name}",
            f"/usr/local/share/fonts/{name}",
            f"/usr/share/fonts/{name}",
            f"/Library/Fonts/{name}",  # macOS just in case
        ])
    for path in candidates:
        if os.path.exists(path):
            return path
    return ""


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    # Try DejaVu fonts first (widely available)
    if bold:
        preferred = ["DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf", "Arial.ttf"]
    else:
        preferred = ["DejaVuSans.ttf", "LiberationSans-Regular.ttf", "Arial.ttf"]

    font_path = find_font_candidate(preferred)
    if font_path:
        try:
            return ImageFont.truetype(font_path, size=size)
        except Exception:
            pass
    # Fallback to default bitmap font
    return ImageFont.load_default()


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def make_vertical_gradient(size: Tuple[int, int], top_rgb: Tuple[int, int, int], bottom_rgb: Tuple[int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", (w, h), top_rgb)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        r = int(lerp(top_rgb[0], bottom_rgb[0], t))
        g = int(lerp(top_rgb[1], bottom_rgb[1], t))
        b = int(lerp(top_rgb[2], bottom_rgb[2], t))
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img


def text_wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> List[str]:
    words = text.split()
    if not words:
        return [""]
    lines: List[str] = []
    cur = words[0]
    for w in words[1:]:
        test = f"{cur} {w}"
        if draw.textlength(test, font=font) <= max_width:
            cur = test
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


def draw_bullets(draw: ImageDraw.ImageDraw, bullets: List[str], font: ImageFont.ImageFont, start_y: int, max_width: int, fill=(240, 244, 255)) -> int:
    y = start_y
    bullet_indent = 30
    bullet_gap = 18
    for bullet in bullets:
        wrapped = text_wrap(draw, bullet, font, max_width - bullet_indent)
        # Draw bullet dot
        draw.text((MARGIN_X, y), "•", font=font, fill=fill)
        # Draw wrapped lines
        for i, line in enumerate(wrapped):
            line_x = MARGIN_X + bullet_indent
            line_y = y + i * (font.size + LINE_SPACING)
            draw.text((line_x, line_y), line, font=font, fill=fill)
        y += len(wrapped) * (font.size + LINE_SPACING) + bullet_gap
    return y


def generate_slide(index: int, title: str, bullets: List[str]) -> str:
    bg = make_vertical_gradient(
        (WIDTH, HEIGHT),
        top_rgb=(3, 7, 18),       # slate-950
        bottom_rgb=(30, 58, 138), # indigo-700
    )
    draw = ImageDraw.Draw(bg)

    title_font = load_font(76, bold=True)
    bullet_font = load_font(44, bold=False)

    # Title shadow for readability
    title_x = MARGIN_X
    title_y = TITLE_Y
    shadow_color = (0, 0, 0)
    main_color = (248, 250, 252)  # slate-50

    # Simple shadow
    draw.text((title_x + 3, title_y + 3), title, font=title_font, fill=shadow_color)
    draw.text((title_x, title_y), title, font=title_font, fill=main_color)

    # Horizontal rule under title
    hr_y = title_y + title_font.size + 24
    draw.line([(MARGIN_X, hr_y), (WIDTH - MARGIN_X, hr_y)], fill=(99, 102, 241), width=4)

    # Bullets
    content_top = hr_y + 40
    max_text_width = WIDTH - 2 * MARGIN_X
    draw_bullets(draw, bullets, bullet_font, content_top, max_text_width)

    filename = os.path.join(SLIDES_DIR, f"slide_{index:03d}.png")
    bg.save(filename)
    return filename


def _assemble_with_moviepy(image_paths: List[str], output_path: str) -> None:
    clips = [ImageClip(p).set_duration(SLIDE_SECONDS) for p in image_paths]
    final = concatenate_videoclips(clips, method="compose")

    # Try H.264 first, then fallback to mpeg4
    try:
        final.write_videofile(
            output_path,
            fps=FPS,
            codec="libx264",
            audio=False,
            preset="medium",
            threads=os.cpu_count() or 2,
        )
    except Exception:
        final.write_videofile(
            output_path,
            fps=FPS,
            codec="mpeg4",
            audio=False,
            preset="medium",
            threads=os.cpu_count() or 2,
        )


def _assemble_with_ffmpeg_concat(image_paths: List[str], output_path: str) -> None:
    if imageio_ffmpeg is None:
        raise RuntimeError("imageio-ffmpeg not available for ffmpeg fallback.")

    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
    # Create a concat demuxer file with durations
    list_file_fd, list_file_path = tempfile.mkstemp(prefix="slides_", suffix=".txt")
    os.close(list_file_fd)
    try:
        with open(list_file_path, "w", encoding="utf-8") as f:
            for i, img in enumerate(image_paths):
                # ffmpeg concat demuxer requires the last file to be listed without duration
                f.write(f"file '{img}'\n")
                if i < len(image_paths) - 1:
                    f.write(f"duration {SLIDE_SECONDS}\n")

        # Build ffmpeg command
        cmd = [
            ffmpeg_path,
            "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", list_file_path,
            # Ensure correct size/padding and frame rate
            "-vf",
            f"scale={WIDTH}:{HEIGHT}:force_original_aspect_ratio=decrease,pad={WIDTH}:{HEIGHT}:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
            "-r", str(FPS),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            output_path,
        ]

        # Run ffmpeg
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0:
            raise RuntimeError(f"ffmpeg failed: {proc.stderr}\nCommand: {' '.join(shlex.quote(c) for c in cmd)}")
    finally:
        try:
            os.remove(list_file_path)
        except OSError:
            pass


def assemble_video(image_paths: List[str], output_path: str) -> None:
    # Try MoviePy first if available
    if ImageClip is not None and concatenate_videoclips is not None:
        try:
            _assemble_with_moviepy(image_paths, output_path)
            return
        except Exception:
            # Fall back to ffmpeg concat
            pass

    # Fallback to ffmpeg concat using imageio-ffmpeg binary
    _assemble_with_ffmpeg_concat(image_paths, output_path)


def get_storyboard() -> List[Tuple[str, List[str]]]:
    return [
        ("Hotel Management System Front-End", [
            "Overview of UX for staff and guests",
            "Responsive, fast, and accessible UI",
        ]),
        ("Core Modules", [
            "Dashboard, Bookings, Rooms, Guests",
            "Payments, Housekeeping, Reports",
        ]),
        ("Design Principles", [
            "Responsive layouts (mobile, tablet, desktop)",
            "Accessible components (WCAG AA)",
            "Fast interactions (optimistic UI, caching)",
        ]),
        ("Typical Booking Flow", [
            "Search dates and occupancy",
            "Select room and rate",
            "Guest details and preferences",
            "Payment and confirmation",
        ]),
        ("Booking Screen", [
            "Date picker, occupancy, promo code",
            "Room cards with price and availability",
            "Rate comparison and policies",
        ]),
        ("Room Details", [
            "Photos, amenities, bed types",
            "Price breakdown, taxes, fees",
            "Cancellation and upgrade options",
        ]),
        ("Guest Management", [
            "Profiles with stay history",
            "Preferences and special requests",
            "Loyalty status and notes",
        ]),
        ("Payments", [
            "Secure checkout with card vaulting",
            "Multiple currencies and invoices",
            "Refunds and partial auths",
        ]),
        ("Housekeeping & Tasks", [
            "Room status (clean/dirty/out-of-order)",
            "Task assignment and tracking",
            "Notifications and batching",
        ]),
        ("Admin Dashboard", [
            "KPIs: Occupancy, ADR, RevPAR",
            "Trends, forecasts, segmentation",
            "Export and scheduled reports",
        ]),
        ("Tech Stack", [
            "React + TypeScript (or Vue/Angular)",
            "Tailwind or CSS Modules",
            "Redux/Zustand + React Query",
        ]),
        ("Best Practices", [
            "Form validation and error states",
            "Timezone and currency formatting",
            "i18n and number/date locales",
        ]),
        ("Thanks!", [
            "Hotel Management System Front-End walkthrough",
            "Questions?",
        ]),
    ]


def main() -> None:
    ensure_dirs()
    storyboard = get_storyboard()

    image_paths: List[str] = []
    for idx, (title, bullets) in enumerate(storyboard, start=1):
        path = generate_slide(idx, title, bullets)
        print(f"Generated: {path}")
        image_paths.append(path)

    print("Assembling video...")
    assemble_video(image_paths, OUTPUT_PATH)
    print(f"Video created at: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
