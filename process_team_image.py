from PIL import Image, ImageEnhance
import os

def process_team_image():
    input_path = "assets/salon-team-storefront.png"
    output_path = "assets/salon-team-optimized.webp"
    
    try:
        if not os.path.exists(input_path):
            print(f"Error: {input_path} does not exist.")
            return

        img = Image.open(input_path)
        width, height = img.size
        
        # Similar cropping strategy to focus on the salon
        # The user wants this to replace 'Team Work', which is usually consistent with the exterior if they don't have a team photo yet.
        # Cropping out Yemen Grill (left 45%) and some bottom pavement.
        
        left = width * 0.45 
        top = height * 0.15
        right = width * 0.95
        bottom = height * 0.85
        
        cropped_img = img.crop((left, top, right, bottom))
        
        # Enhance
        enhancer = ImageEnhance.Sharpness(cropped_img)
        enhanced_img = enhancer.enhance(1.4) 
        
        contrast = ImageEnhance.Contrast(enhanced_img)
        final_img = contrast.enhance(1.1)
        
        # Resize
        final_width = 1000 # Good size for the About section image
        w_percent = (final_width / float(final_img.size[0]))
        h_size = int((float(final_img.size[1]) * float(w_percent)))
        final_img = final_img.resize((final_width, h_size), Image.Resampling.LANCZOS)
        
        final_img.save(output_path, "WEBP", quality=90)
        print("Success: Processed " + output_path)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    process_team_image()
