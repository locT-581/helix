//! # Video Processor (Rust/WASM)
//!
//! Video metadata processing for Helix video editor.
//! Note: Most video metadata extraction uses Web APIs (HTMLVideoElement) from JavaScript.
//! This crate provides utilities for video info calculations and format detection.
//!
//! ## Features
//! - Video metadata types
//! - Aspect ratio calculations
//! - Frame rate utilities
//! - Resolution helpers
//!
//! ## Performance
//! - Aspect ratio calc: <1ms
//! - Resolution fit: <1ms

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use thiserror::Error;

/// Video processing errors
#[derive(Error, Debug)]
pub enum VideoError {
    #[error("Invalid dimensions: width={width}, height={height}")]
    InvalidDimensions { width: u32, height: u32 },

    #[error("Invalid frame rate: {0}")]
    InvalidFrameRate(f64),

    #[error("Invalid duration: {0}")]
    InvalidDuration(f64),
}

impl From<VideoError> for JsValue {
    fn from(err: VideoError) -> Self {
        JsValue::from_str(&err.to_string())
    }
}

// Enable console.log from Rust
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

/// Initialize the video processor
#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();

    log("Helix Video Processor initialized (Rust/WASM)");
}

/// Video metadata structure
#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct VideoMetadata {
    pub width: u32,
    pub height: u32,
    pub duration: f64,
    pub frame_rate: Option<f64>,
}

#[wasm_bindgen]
impl VideoMetadata {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32, duration: f64) -> Result<VideoMetadata, JsValue> {
        if width == 0 || height == 0 {
            return Err(VideoError::InvalidDimensions { width, height }.into());
        }
        if duration < 0.0 {
            return Err(VideoError::InvalidDuration(duration).into());
        }
        Ok(VideoMetadata {
            width,
            height,
            duration,
            frame_rate: None,
        })
    }

    /// Calculate aspect ratio (width / height)
    pub fn aspect_ratio(&self) -> f64 {
        self.width as f64 / self.height as f64
    }

    /// Check if video is landscape (width > height)
    pub fn is_landscape(&self) -> bool {
        self.width > self.height
    }

    /// Check if video is portrait (height > width)
    pub fn is_portrait(&self) -> bool {
        self.height > self.width
    }

    /// Check if video is square (width == height)
    pub fn is_square(&self) -> bool {
        self.width == self.height
    }

    /// Set frame rate
    pub fn with_frame_rate(&mut self, fps: f64) -> Result<(), JsValue> {
        if fps <= 0.0 {
            return Err(VideoError::InvalidFrameRate(fps).into());
        }
        self.frame_rate = Some(fps);
        Ok(())
    }

    /// Calculate total frame count (if frame_rate is set)
    pub fn total_frames(&self) -> Option<u32> {
        self.frame_rate.map(|fps| (self.duration * fps) as u32)
    }
}

/// Calculate aspect ratio from dimensions
#[wasm_bindgen]
pub fn calculate_aspect_ratio(width: u32, height: u32) -> Result<f64, JsValue> {
    if width == 0 || height == 0 {
        return Err(VideoError::InvalidDimensions { width, height }.into());
    }
    Ok(width as f64 / height as f64)
}

/// Fit dimensions to target size while preserving aspect ratio
///
/// # Arguments
/// * `src_width` - Source width
/// * `src_height` - Source height
/// * `target_width` - Target width
/// * `target_height` - Target height
///
/// # Returns
/// * `[fitted_width, fitted_height]`
///
/// # Example (JavaScript)
/// ```javascript
/// const [w, h] = fit_dimensions(1920, 1080, 800, 600);
/// // Returns [800, 450] - fits width, scales height
/// ```
#[wasm_bindgen]
pub fn fit_dimensions(src_width: u32, src_height: u32, target_width: u32, target_height: u32) -> Vec<u32> {
    if src_width == 0 || src_height == 0 {
        return vec![target_width, target_height];
    }

    let src_aspect = src_width as f64 / src_height as f64;
    let target_aspect = target_width as f64 / target_height as f64;

    let (fitted_width, fitted_height) = if src_aspect > target_aspect {
        // Fit to width
        let height = (target_width as f64 / src_aspect) as u32;
        (target_width, height)
    } else {
        // Fit to height
        let width = (target_height as f64 * src_aspect) as u32;
        (width, target_height)
    };

    vec![fitted_width, fitted_height]
}

/// Common video resolutions
#[wasm_bindgen]
pub struct VideoResolution;

#[wasm_bindgen]
impl VideoResolution {
    /// 1920x1080 (Full HD)
    pub fn full_hd() -> Vec<u32> {
        vec![1920, 1080]
    }

    /// 1280x720 (HD)
    pub fn hd() -> Vec<u32> {
        vec![1280, 720]
    }

    /// 3840x2160 (4K UHD)
    pub fn uhd_4k() -> Vec<u32> {
        vec![3840, 2160]
    }

    /// 720x480 (SD)
    pub fn sd() -> Vec<u32> {
        vec![720, 480]
    }

    /// 640x480 (VGA)
    pub fn vga() -> Vec<u32> {
        vec![640, 480]
    }

    /// 1080x1920 (Vertical Full HD - Mobile)
    pub fn vertical_full_hd() -> Vec<u32> {
        vec![1080, 1920]
    }

    /// 1080x1080 (Square - Instagram)
    pub fn square_hd() -> Vec<u32> {
        vec![1080, 1080]
    }
}

/// Get video processor version
#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_video_metadata_creation() {
        let meta = VideoMetadata::new(1920, 1080, 120.5).unwrap();
        assert_eq!(meta.width, 1920);
        assert_eq!(meta.height, 1080);
        assert_eq!(meta.duration, 120.5);
        assert!(meta.is_landscape());
        assert!(!meta.is_portrait());
        assert!(!meta.is_square());

        let invalid_dims = VideoMetadata::new(0, 1080, 120.0);
        assert!(invalid_dims.is_err());

        let invalid_duration = VideoMetadata::new(1920, 1080, -5.0);
        assert!(invalid_duration.is_err());
    }

    #[test]
    fn test_aspect_ratio() {
        let meta = VideoMetadata::new(1920, 1080, 120.0).unwrap();
        assert!((meta.aspect_ratio() - 1.7777777778).abs() < 0.001);

        let ratio = calculate_aspect_ratio(1920, 1080).unwrap();
        assert!((ratio - 1.7777777778).abs() < 0.001);

        let vertical = VideoMetadata::new(1080, 1920, 60.0).unwrap();
        assert!(vertical.is_portrait());
        assert!((vertical.aspect_ratio() - 0.5625).abs() < 0.001);
    }

    #[test]
    fn test_fit_dimensions() {
        // Fit 1920x1080 to 800x600
        let fitted = fit_dimensions(1920, 1080, 800, 600);
        assert_eq!(fitted, vec![800, 450]);

        // Fit 1080x1920 (vertical) to 800x600
        let vertical_fitted = fit_dimensions(1080, 1920, 800, 600);
        assert_eq!(vertical_fitted, vec![337, 600]);

        // Fit square to landscape
        let square_fitted = fit_dimensions(1080, 1080, 800, 600);
        assert_eq!(square_fitted, vec![600, 600]);
    }

    #[test]
    fn test_frame_rate() {
        let mut meta = VideoMetadata::new(1920, 1080, 10.0).unwrap();
        assert!(meta.total_frames().is_none());

        meta.with_frame_rate(30.0).unwrap();
        assert_eq!(meta.total_frames(), Some(300));

        let invalid_fps = meta.with_frame_rate(-10.0);
        assert!(invalid_fps.is_err());
    }

    #[test]
    fn test_video_resolution_presets() {
        assert_eq!(VideoResolution::full_hd(), vec![1920, 1080]);
        assert_eq!(VideoResolution::hd(), vec![1280, 720]);
        assert_eq!(VideoResolution::uhd_4k(), vec![3840, 2160]);
        assert_eq!(VideoResolution::vertical_full_hd(), vec![1080, 1920]);
        assert_eq!(VideoResolution::square_hd(), vec![1080, 1080]);
    }

    #[test]
    fn test_orientation() {
        let landscape = VideoMetadata::new(1920, 1080, 60.0).unwrap();
        assert!(landscape.is_landscape());

        let portrait = VideoMetadata::new(1080, 1920, 60.0).unwrap();
        assert!(portrait.is_portrait());

        let square = VideoMetadata::new(1080, 1080, 60.0).unwrap();
        assert!(square.is_square());
    }
}
