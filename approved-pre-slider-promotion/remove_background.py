import os
from PIL import Image

def process_image(img_path):
    print(f"Processing {img_path}...")
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    def is_white(pos):
        r, g, b, a = pixels[pos]
        # Check if the pixel is near-white (threshold 235)
        return r > 235 and g > 235 and b > 235 and a > 0

    # Flood fill starting from the four corners to remove background
    visited = set()
    corners = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
    queue = []
    
    for pt in corners:
        if is_white(pt):
            queue.append(pt)
            visited.add(pt)
        
    while queue:
        curr = queue.pop(0)
        x, y = curr
        pixels[x, y] = (0, 0, 0, 0) # Set to fully transparent
        
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited and is_white((nx, ny)):
                    visited.add((nx, ny))
                    queue.append((nx, ny))
                    
    img.save(img_path, "PNG")
    print(f"Successfully removed white background: {img_path}")

# Autodetect path
paths_to_try = [
    "assets/Left.png",
    "assets/Right.png",
    "../assets/Left.png",
    "../assets/Right.png",
    "approved-pre-slider-promotion/assets/Left.png",
    "approved-pre-slider-promotion/assets/Right.png"
]

processed_any = False
for path in paths_to_try:
    if os.path.exists(path):
        try:
            process_image(path)
            processed_any = True
        except Exception as e:
            print(f"Error processing {path}: {e}")

if not processed_any:
    print("Could not find Left.png or Right.png in standard asset locations.")
    print("Please make sure they are saved as Left.png and Right.png inside your assets folder.")
