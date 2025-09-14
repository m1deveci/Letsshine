import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { X, Check, RotateCcw } from 'lucide-react';
import Button from './Button';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number; // Default 1:1 for profile photos
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  }, [aspectRatio]);

  const getCroppedImg = useCallback(
    (
      image: HTMLImageElement,
      crop: PixelCrop,
      scale = 1,
      rotate = 0,
    ): Promise<Blob | null> => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      // devicePixelRatio slightly increases sharpness on retina devices
      // at the expense of slightly slower render times and needing to
      // size the image back down if you want to download/upload and be
      // true to the images natural size.
      const pixelRatio = window.devicePixelRatio;
      // const pixelRatio = 1

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const rotateRads = rotate * Math.PI / 180;
      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();

      // 5) Move the crop origin to the canvas origin (0,0)
      ctx.translate(-cropX, -cropY);
      // 4) Move the origin to the center of the original position
      ctx.translate(centerX, centerY);
      // 3) Rotate around the origin
      ctx.rotate(rotateRads);
      // 2) Scale the image
      ctx.scale(scale, scale);
      // 1) Move the center of the image to the origin (0,0)
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
      );

      ctx.restore();

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.9
        );
      });
    },
    []
  );

  const handleCropComplete = useCallback(async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      try {
        const croppedImageBlob = await getCroppedImg(
          imgRef.current,
          completedCrop,
          scale,
          rotate
        );
        if (croppedImageBlob) {
          onCropComplete(croppedImageBlob);
        }
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    }
  }, [completedCrop, scale, rotate, getCroppedImg, onCropComplete]);

  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setScale(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Fotoğrafı Düzenle
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Yakınlaştır:
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
                className="w-24"
              />
              <span className="text-sm text-gray-600">{scale.toFixed(1)}x</span>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleRotate}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              90° Döndür
            </Button>
          </div>

          {/* Crop Area */}
          <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={100}
              minHeight={aspectRatio === 1 ? 100 : 100 / aspectRatio}
              circularCrop={aspectRatio === 1} // Circular crop for profile photos (1:1 ratio)
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxHeight: '500px',
                  maxWidth: '100%'
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              İptal
            </Button>
            <Button
              type="button"
              onClick={handleCropComplete}
              disabled={!completedCrop?.width || !completedCrop?.height}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Kaydet
            </Button>
          </div>
        </div>

        {/* Hidden canvas for preview */}
        <canvas
          ref={previewCanvasRef}
          style={{
            display: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default ImageCropModal;