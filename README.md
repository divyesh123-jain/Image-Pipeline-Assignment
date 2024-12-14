# Image Inpainting Widget

A modern, interactive web application for creating image masks through drawing. Built with React, TypeScript, and Fabric.js.

![Image Inpainting Widget](https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074&auto=format&fit=crop)

## Features

- **Image Upload**
  - Drag and drop support
  - Click to upload
  - Supports JPEG and PNG formats
  - Automatic image scaling and centering

- **Drawing Tools**
  - Adjustable brush size
  - Color palette with 5 preset colors
  - Clear canvas option

- **Mask Generation**
  - Real-time preview
  - Side-by-side output of original and mask
  - High-quality export
  - Semi-transparent overlay for better visibility

- **Modern UI/UX**
  - Responsive design
  - Intuitive controls
  - Visual feedback
  - Toast notifications
  - Keyboard shortcuts (coming soon)

## Technologies Used

- **Frontend Framework**
  - React 18
  - TypeScript
  - Vite

- **Styling**
  - Tailwind CSS
  - Lucide Icons

- **Canvas Manipulation**
  - Fabric.js

- **Other Tools**
  - React Hot Toast (notifications)
  - ESLint (code quality)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/image-inpainting-widget.git
   ```

2. Navigate to the project directory:
   ```bash
   cd image-inpainting-widget
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Usage

1. **Upload an Image**
   - Drag and drop an image onto the canvas area, or
   - Click the upload area to select an image from your device

2. **Create a Mask**
   - Use the brush tools to draw on the image
   - Adjust brush size using the + and - buttons
   - Select different colors from the palette
   - Use undo/redo for corrections
   - Clear the canvas to start over

3. **Generate Output**
   - Click "Generate Mask" to create the final image
   - The result will show both the original image and the mask side by side

## Project Structure

```
src/
├── components/
│   ├── Canvas/
│   │   ├── BrushControls.tsx    # Brush size and color controls
│   │   ├── Canvas.tsx           # Main canvas component
│   │   ├── CanvasControls.tsx   # Clear and generate buttons
│   │   ├── UploadPrompt.tsx     # Image upload UI
│   │   └── useCanvas.ts         # Canvas logic and state management
│   └── ImagePair/
│       └── ImagePair.tsx        # Side-by-side image display
├── App.tsx                      # Main application component
└── main.tsx                     # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Fabric.js](http://fabricjs.com/) for the powerful canvas manipulation library
- [Lucide Icons](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## Future Improvements

- [ ] Add keyboard shortcuts for common actions
- [ ] Implement brush opacity control
- [ ] Add layer support for complex masks
- [ ] Provide mask smoothing options
- [ ] Add image filters and adjustments
- [ ] Implement mask export options (PNG/JPEG)
- [ ] Add touch support for mobile devices