from PIL import Image, ImageEnhance, ImageFilter
import os

def process_image():
    input_path = "assets/salon-original.png"
    output_path = "assets/salon-exterior.webp"
    
    try:
        img = Image.open(input_path)
        width, height = img.size
        
        # Crop Strategy:
        # Original has Yemen Grill on left, Salon on right.
        # We want to keep the right ~55% and remove the far left.
        # Also crop a bit of the bottom (parking lot) to focus on the store.
        
        left = width * 0.45  # Cut off left 45% (Yemen Grill)
        top = height * 0.15   # Cut off top sky excess
        right = width * 0.95  # Slight trim on right
        bottom = height * 0.85 # Cut off bottom 15% (partial cars)
        
        cropped_img = img.crop((left, top, right, bottom))
        
        # Enhance Sharpness
        enhancer = ImageEnhance.Sharpness(cropped_img)
        enhanced_img = enhancer.enhance(1.5) # Increase sharpness
        
        # Enhance Contrast slightly
        contrast = ImageEnhance.Contrast(enhanced_img)
        final_img = contrast.enhance(1.1)
        
        # Resize for web (max width 1200)
        final_width = 1200
        w_percent = (final_width / float(final_img.size[0]))
        h_size = int((float(final_img.size[1]) * float(w_percent)))
        final_img = final_img.resize((final_width, h_size), Image.Resampling.LANCZOS)
        
        final_img.save(output_path, "WEBP", quality=90)
        print("Success: Image processed and saved to " + output_path)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    process_image()
