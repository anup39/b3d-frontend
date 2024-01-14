# B3d - Drone Processing Platform

B3d is a powerful and feature-rich drone processing platform designed to streamline and enhance the processing of drone data. With a focus on providing robust features and cost-effective pricing, B3d stands out as a complete solution for drone data management and visualization.

## Getting Started

To get started with B3d, follow the steps below:

1. **Clone the Repository:**
   ```bash
   git clone git@github.com:anup39/b3d-frontend.git
   ```

cd b3d

npm install

Configure Backend APIs:

# Create a .env file in the root directory.

# Configure the backend APIs in the .env file.

Run the Development Server:

`npm run dev`

This command will start the development server, and you can access B3d at http://localhost:5173 in your web browser.

## Features

    Data Processing
    Upload raw GCP images for ground control points.
    Process GCP images into GeoTIFF, point clouds, and meshes.
    Independent upload of GeoTIFF files with support for files larger than 15GB.
    Visualization
    Complete 2D and 3D visualization of drone data.
    Segment and digitize vector layer points, lines, and polygons from drone images.
    Support for third-party uploads, such as Shapefile and GeoJSON, with up to 10GB of data in a single upload.
    Deep Learning
    Automated segmentation of classes from GeoTIFF using deep learning methods.
    GPU Rendering
    GPU-based rendering for vectors and various file formats using WebGL2.
    Reporting
    High-quality report generation with a single click.
    Layer Support
    Support for WMTS and XYZ layers defined by OGC with super high speed.
    User Management
    Complete user management and role-based access control.
    Collaboration
    Real-time collaboration features similar to Google Docs.
    Notes
    Ensure that backend API configurations in the .env file are accurate.
    For optimal performance, it is recommended to run B3d on a system with a capable GPU.
    Feel free to explore the B3d platform and leverage its rich set of features for efficient drone data processing and visualization. If you encounter any issues or have questions, please refer to the documentation or reach out to our support team. Happy droning!
