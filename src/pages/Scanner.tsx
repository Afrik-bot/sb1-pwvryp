import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { CameraIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getRecyclingInstructions } from '../services/recyclingData';

function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    item: string;
    confidence: number;
    recyclable: boolean;
    instructions: string;
  } | null>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const initTensorFlow = async () => {
      await tf.setBackend('webgl');
      await tf.ready();
      const loadedModel = await cocoSsd.load({
        base: 'mobilenet_v2'
      });
      setModel(loadedModel);
    };

    initTensorFlow();
  }, []);

  const capture = async () => {
    if (!model) return;
    
    setIsScanning(true);
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const predictions = await model.detect(img);
        if (predictions.length > 0) {
          const topPrediction = predictions[0];
          const recyclingInfo = getRecyclingInstructions(topPrediction.class);
          
          setResult({
            item: topPrediction.class,
            confidence: topPrediction.score,
            recyclable: recyclingInfo.recyclable,
            instructions: recyclingInfo.instructions
          });
        }
      }
    } catch (error) {
      console.error('Scanning error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Scan Item</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="relative aspect-video mb-4">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg w-full"
            videoConstraints={{
              facingMode: 'environment',
              width: 1280,
              height: 720
            }}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={capture}
            disabled={isScanning || !model}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isScanning ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <CameraIcon className="h-5 w-5 mr-2" />
            )}
            {!model ? 'Loading...' : isScanning ? 'Scanning...' : 'Scan Item'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h2 className="font-semibold mb-2">Scan Result:</h2>
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg">{result.item}</p>
              <span className="text-sm text-gray-600">
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Recycling Status:</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                result.recyclable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.recyclable ? 'Recyclable' : 'Not Recyclable'}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Instructions:</h3>
                <p className="text-gray-700">{result.instructions}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scanner;