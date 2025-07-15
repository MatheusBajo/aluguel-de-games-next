#!/usr/bin/env python3
"""
Converte todas as imagens de Comprimir/ (e subpastas) para WebP,
comprime vídeos para H.264/AAC, apaga os originais e,
quando existir metadata.json na pasta, atualiza o array "imagens"
com os arquivos .webp restantes.
"""

from pathlib import Path
from subprocess import run, CalledProcessError
import json
from PIL import Image

# ----------------------- Configurações -----------------------
ROOT = Path(__file__).parent / "Comprimir"   # pasta‑raiz a processar
IMG_QUALITY = 80                             # qualidade WebP (0‑100)
VIDEO_CRF = 26                               # taxa de compressão (18~30)
VIDEO_PRESET = "medium"                      # ultrafast, fast, medium, slow…
# -------------------------------------------------------------

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif"}
VIDEO_EXTS = {".mp4", ".mov", ".avi", ".mkv", ".flv", ".webm"}

def convert_image(path: Path) -> Path | None:
    """Converte `path` → .webp, apaga original e retorna o novo Path."""
    dst = path.with_suffix(".webp")
    try:
        with Image.open(path) as im:
            im = im.convert("RGBA" if im.mode in ("RGBA", "LA") else "RGB")
            im.save(dst, "webp", quality=IMG_QUALITY, method=6)
        path.unlink()
        print(f"🖼️  {path.relative_to(ROOT)}  →  {dst.name}")
        return dst
    except Exception as e:
        print(f"❌ Erro convertendo {path}: {e}")
        return None

def compress_video(path: Path):
    """
    Reencoda vídeo com FFmpeg.
    1) cria arquivo temporário (.tmp.mp4)
    2) se sucesso, apaga original
    3) renomeia temporário para o nome antigo
    """
    tmp = path.with_suffix(".tmp.mp4")
    cmd = [
        "ffmpeg", "-y", "-i", str(path),
        "-c:v", "libx264", "-preset", VIDEO_PRESET, "-crf", str(VIDEO_CRF),
        "-c:a", "aac", "-movflags", "+faststart",
        str(tmp)
    ]

    try:
        run(cmd, check=True, capture_output=True)
        path.unlink()          # remove original
        tmp.rename(path)       # coloca comprimido no lugar
        print(f"🎞️  {path.relative_to(ROOT)}  →  comprimido ✅")
    except CalledProcessError as e:
        print(f"❌ FFmpeg falhou em {path}:\n{e.stderr.decode(errors='ignore')}")
        if tmp.exists():
            tmp.unlink()       # remove temporário se falhou

def process_folder(folder: Path):
    """Percorre pasta, converte/comprime arquivos e atualiza metadata.json."""
    # 1) processar arquivos
    for item in folder.iterdir():
        if item.is_dir():
            process_folder(item)
            continue

        ext = item.suffix.lower()
        if ext in IMAGE_EXTS:
            convert_image(item)
        elif ext in VIDEO_EXTS:
            compress_video(item)
        # outros tipos são ignorados

    # 2) atualizar metadata.json, se existir
    meta = folder / "metadata.json"
    if meta.exists():
        try:
            imagens = sorted(p.name for p in folder.glob("*.webp"))
            with meta.open(encoding="utf-8") as f:
                data = json.load(f)
            data["imagens"] = imagens
            with meta.open("w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"📝 metadata.json atualizado em {folder.relative_to(ROOT)}")
        except Exception as e:
            print(f"❌ Erro atualizando {meta}: {e}")

if __name__ == "__main__":
    if not ROOT.exists():
        print(f"🚫 Pasta não encontrada: {ROOT}")
        exit(1)

    print("🚀 Iniciando conversão/compressão...")
    process_folder(ROOT)
    print("✅ Tudo concluído!")
