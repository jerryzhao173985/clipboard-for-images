import { Clipboard, showHUD } from "@raycast/api";
import { execSync } from "child_process";
import fs from "fs";

export default function Command() {
  (async () => {
    try {
      // To Open file picker and get the selected file path
      let filePath = execSync('osascript -e \'choose file with prompt "Select an image" of type {"public.image"}\'')
        .toString()
        .trim();

      // To Fix macOS path format (sometimes returns "Macintosh HD:Users:..." instead of "/Users/...")
      if (filePath.includes(":")) {
        filePath = filePath.replace(/^.*?:/, "/").replace(/:/g, "/");
      }

      if (!filePath) {
        throw new Error("No file selected.");
      }

      // To Ensure the path exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`Image file does not exist at path: ${filePath}`);
      }

      // To Copy image to clipboard
      await Clipboard.copy({ file: filePath });

      // To Notify user
      await showHUD("✅ Image copied to clipboard!");
    } catch (error: any) {
      await showHUD(`❌ Error: ${error.message}`);
    }
  })();

  return null; // Prevent React from rendering anything
}
